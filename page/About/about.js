import React from 'react';
import Navbar from '../../components/common/Navbar/Navbar.js';
import './about.css';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-content">
                <section className="about-section">
                    <h1>About Us</h1>
                    <p>Welcome to Spacecrafted, your ultimate online property marketplace with state-of-the-art virtual staging. Our platform revolutionizes the way you buy, sell, and rent properties by combining innovative technology with user-friendly tools, designed to enhance the real estate experience for everyone involved.</p>
                    <p>At Spacecrafted, our mission is to simplify and elevate the real estate process. We aim to provide an efficient, and visually engaging platform that connects buyers, sellers, and real estate agents. Through our advanced features, we aim to transform the way properties are marketed and discovered.</p>

                    <h1>What We Offer</h1>
                    <p><strong>Property Listings</strong><br />
                        Create detailed property listings easily. Include essential information such as location, price, property type, number of bedrooms and photos. Each listing offers a comprehensive overview to help buyers make informed decisions.</p>

                    <p><strong>Advanced Search and Filters</strong><br />
                        Filter properties by location, price range, property type, and more to match your specific needs and preferences.</p>

                    <p><strong>Virtual Staging</strong><br />
                        Experience our cutting-edge virtual staging feature powered by advanced AI technology. Real estate agents can significantly enhance the visual appeal of their listings, making them more attractive to potential buyers.</p>

                    <p><strong>User Accounts</strong><br />
                        Tailored accounts for buyers and sellers:
                        <ul>
                            <li><strong>Buyers</strong>: Create a favorites list of properties you love.</li>
                            <li><strong>Sellers/Agents</strong>: Manage your active and past listings through a dedicated dashboard.</li>
                        </ul>
                    </p>

                    <p><strong>Interactive Maps</strong><br />
                        Explore property locations and nearby amenities with integrated maps. Visualize neighborhoods and make better decisions about where to live or invest.</p>

                    <p><strong>Integrated Viewing Scheduler</strong><br />
                        Schedule viewings seamlessly between agents and buyers, making the process smooth and convenient for both parties.</p>


                    <h1>Contact Us</h1>
                    <p>We’re here to help you make the most of your real estate journey. Whether you’re a buyer, seller, or agent, Spacecraft is dedicated to providing you with the tools and support you need. Get in touch with us today to learn more or start exploring properties.</p>


                    <p>Spacecrafted - Redefining Real Estate</p>
                </section>
            </div>
        </div>
    );
};

export default About;
