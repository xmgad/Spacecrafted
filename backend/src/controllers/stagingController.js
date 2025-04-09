import sharp from "sharp" // TODO: uninstall sharp module after adding staging model
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import User from "../models/userModel.js"
import Subscription from "../models/subscriptionModel.js"
import axios from "axios"
import { deleteStageImage } from "../config/s3.config.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const userCanStage = async (user) => {
    let planHasAvailableStagings = false
    if (user.subscriptionId) {
        const sub = await Subscription.findById(user.subscriptionId)
        planHasAvailableStagings =
            sub.plan === "Premium Pay-as-you-go" || sub.numStagings > 0
    }
    const canStage = user.hasTrial || planHasAvailableStagings

    return canStage
}

const updateUserStagingQuota = async (user) => {
    if (user.subscriptionId) {
        const sub = await Subscription.findById(user.subscriptionId)
        const isMonthly = sub.plan === "Premium Monthly"
        if (!isMonthly) {
            sub.numStagings += 1
            console.log(sub);
            return await sub.save()
        }
        if (sub.numStagings > 0) {
            sub.numStagings -= 1
            return await sub.save()
        }
        user.hasTrial = false
        await user.save()
    }
}

// TODO: for testing - remove
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
const stagingApiUrl = "https://api.decor8.ai/generate_designs_for_room"
const applyStaging = async (inputImageUrl) => {
    const body = {
        input_image_url: inputImageUrl,
        room_type: "livingroom",
        design_style: "minimalist",
    }
    const jsonBody = JSON.stringify(body)
    const stagingResponse = await fetch(stagingApiUrl, {
        method: "POST",
        body: jsonBody,
        headers: {
            Authorization: `Bearer ${process.env.DECOR8AI_TOKEN}`,
            "Content-Type": "application/json",
        },
    })
    const stagingData = await stagingResponse.json()
    const images = stagingData.info?.images
    if (!stagingResponse.ok || !images) {
        console.log("RESPONSE:", stagingData)
        throw new Error("Failed to stage image")
    }
    const stagedImageUrl = images[0].url
    // image staged
    const response = await axios.get(stagedImageUrl, {
        responseType: "arraybuffer",
    })
    const stagedImage = Buffer.from(response.data, "binary")

    const watermarked = await addWatermark(stagedImage)

    return watermarked
}

const addWatermark = async (inputImageBuffer) => {
    const watermarkPath = join(__dirname, "../assets/spc_logo.png")
    const watermark = await sharp(watermarkPath).toBuffer()
    const inputMetadata = await sharp(inputImageBuffer).metadata()

    //  calculate watermark to 10% of image width
    const watermarkSize = Math.round(inputMetadata.width * 0.1)

    // resize watermark
    const resizedWatermark = await sharp(watermark)
        .resize(watermarkSize)
        .toBuffer()

    const resizedWatermarkMeta = await sharp(resizedWatermark).metadata()

    const marginX = Math.floor(
        inputMetadata.width - watermarkSize - (inputMetadata.width * 2) / 100
    )
    const marginY = Math.floor(
        inputMetadata.height -
            resizedWatermarkMeta.height -
            (inputMetadata.height * 2) / 100
    )

    // add watermark to image
    const watermarkedImage = await sharp(inputImageBuffer)
        .composite([
            {
                input: resizedWatermark,
                gravity: "southeast",
                top: marginY,
                left: marginX,
            },
        ])
        .toBuffer()

    return watermarkedImage
}

const stageImage = async (req, res) => {
    const imageKey = req.file?.key
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            throw new Error("User not found")
        }
        const canStage = await userCanStage(user)
        if (!canStage) {
            return res.status(400).json({
                message:
                    "You have no more stagings left. Please subscribe/upgrade your plan to stage more images.",
            })
        }
        let imageUrl = null
        if (req.file) {
            imageUrl = req.file.location
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl
        }
        if (!imageUrl) {
            return res
                .status(400)
                .json({ message: "Please send an image to stage" })
        }
        const stagedImage = await applyStaging(imageUrl)

        // update user trial flag
        await updateUserStagingQuota(user)

        res.set("Content-Type", "image/png")
        res.status(200).send(stagedImage)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error processing image" })
    } finally {
        // delete temporary image, if any
        if (imageKey) await deleteStageImage(imageKey)
    }
}

export { stageImage }
