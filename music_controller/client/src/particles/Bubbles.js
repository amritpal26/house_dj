import React, { useEffect, useState } from 'react';
import Particles from 'react-particles-js';

export default function Bubbles() {
    const [width, setWidth] = useState('0px');
    const [height, setHeight] = useState('0px');

    const updateWindowDimensions = () => {
        setWidth(`${window.innerWidth}px`);
        setHeight(`${window.innerHeight}px`);
    }

    useEffect(() => {
        updateWindowDimensions();
        window.addEventListener("resize", updateWindowDimensions);

        return () => {
            window.removeEventListener("resize", updateWindowDimensions);
        }
    });

    const params = {
        "particles": {
            "number": {
                "value": 160,
                "density": {
                    "enable": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "speed": 4,
                    "size_min": 0.3
                }
            },
            "line_linked": {
                "enable": false
            },
            "move": {
                "random": true,
                "speed": 1,
                "direction": "top",
                "out_mode": "out"
            }
        },
        "interactivity": {
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "bubble"
                },
            },
            "modes": {
                "bubble": {
                    "distance": 250,
                    "duration": 2,
                    "size": 0,
                    "opacity": 0
                },
                "repulse": {
                    "distance": 400,
                    "duration": 4
                }
            }
        }
    };

    return (
        <Particles
            style={{
                position: 'absolute',
                height: height,
                width: width,
                top: 0,
                left: 0
            }}
            params={params}
        />
    )
};