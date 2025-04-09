import React, { useState } from "react"
import "./StagingDialog.css"
import SPCButton from "../../SPCButton/SPCButton"
import SPCLoadingButton from "../../SPCLoadingButton/SPCLoadingButton"
import { ReactComponent as StageIcon } from "../../../../icons/Stage.svg"
import { useStage } from "../../../../hooks/Staging/useStage"
import SPCBaseDialog from "../SPCBaseDialog/SPCBaseDialog"

const StagingDialog = ({ isOpen, image, onConfirm, onCancel }) => {
    const [stagedImage, setStagedImage] = useState(null)
    const { stageImage, isLoading, error } = useStage()
    const imageUrl = stagedImage
        ? URL.createObjectURL(stagedImage)
        : image.url
        ? image.url
        : URL.createObjectURL(image)
    const tint = "var(--primary)"
    const imageOpacity = isLoading ? 0.3 : 1.0

    const handleStage = async () => {
        const staged = await stageImage(image)
        setStagedImage(staged)
    }
    return (
        <SPCBaseDialog
            isOpen={isOpen}
            className="staging-dialog"
            contentLabel="Staging"
        >
            <h2 className="dialog-title" style={{ color: tint }}>
                Staging
            </h2>
            <div className="dialog-message">
                Present this room as a fully furnished lively space!
            </div>
            <img
                className="staging-preview-img"
                src={imageUrl}
                alt="image preview"
                style={{opacity: imageOpacity}}
            />
            {error && <div className="staging-error">{error}</div>}
            <SPCLoadingButton
                className="staging-button"
                tint="var(--gradient-hrz)"
                loading={isLoading}
                onClick={handleStage}
                disabled={stagedImage != null}
            >
                <div className="staging-button-content">
                    <StageIcon className="staging-button-icon" />
                    <p>Stage it!</p>
                </div>
            </SPCLoadingButton>
            <div className="dialog-buttons">
                <SPCButton
                    disabled={stagedImage == null}
                    onClick={ () => onConfirm(stagedImage)}
                    tint={tint}
                >
                    Confirm
                </SPCButton>
                <SPCButton disabled={isLoading} buttonType="text" onClick={onCancel} tint={tint}>
                    Cancel
                </SPCButton>
            </div>
        </SPCBaseDialog>
    )
}

export default StagingDialog
