import React from "react"
import "./home.css"
import beforeImage from "../../images/beforeImage.PNG"
import afterImage from "../../images/afterImage.PNG"
import { useNavigate } from "react-router-dom"
import SPCButton from "../../components/common/SPCButton/SPCButton"
import { ReactComponent as ArrowIcon } from "../../icons/Arrow.svg"

const HomePage = () => {
    const navigate = useNavigate()
    return (
        <div className="home-page">
            <div className="colored-section-container">
                <div className="home-page__colored-section" />
                <div className="colored-section-mask" />
            </div>
            <div className="home-page-content">
                <div className="home-page-text-container">
                    <h1 className="home-page__title">
                        Turn today's space into tomorrow's home
                    </h1>
                    <h2 className="home-page__subtitle">
                        Revolutionizing Property Listings—Discover and Connect
                        with Ideal Properties or Buyers, Enhanced by Virtual
                        Staging to Transform Spaces and Visualize Potential
                    </h2>
                    <SPCButton
                        className="start-button"
                        tint="#112533"
                        icon={ArrowIcon}
                        iconPosition="right"
                        onClick={() => navigate("/search")}
                        buttonType="default_light"
                    >
                        Start now
                    </SPCButton>
                </div>
                <div className="home-page-image-container">
                    <div className="home-page__image-box">
                        <img src={beforeImage} alt="Before" className="image" />
                        <div className="text-overlay">Before</div>
                    </div>
                    <div className="home-page__image-box">
                        <img src={afterImage} alt="After" className="image" />
                        <div className="text-overlay">After</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
