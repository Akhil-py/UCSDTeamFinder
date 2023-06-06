import "./Playercard.css"
import AOS from 'aos';
import React, {useEffect} from "react";

export default function Playercard(values){
    useEffect(() => {
        AOS.init({duration: 2000});
    }, []); 
    return (
        <div>
            <div className="player-container" data-aos="fade-right">
                <div className="profile-card">
                    <img src={require("./Images/dotabg.jpeg")} alt="" className="cover-pic"></img>
                    <img src={require("./Images/heroicon.jpeg")} alt="" className="profile-pic"></img>
                    <h1 className="name">{values.dotaUsername}</h1>
                    <p>San Diego, California, United States</p>
                    <div className="row">
                        <div>
                            <h1>{values.role}</h1>
                            <h2>ROLE</h2>
                        </div>
                        <div>
                            <h1>{values.rank}</h1>
                            <h2>RANK</h2>
                        </div>
                        <div>
                            <h1>{values.region}</h1>
                            <h2>REGION</h2>
                        </div>
                    </div>
                    <div className="button-container">
                        <button>Request Information</button>
                        <button>Send Message</button>
                    </div>
                </div>
            </div>
        </div>
    )
}