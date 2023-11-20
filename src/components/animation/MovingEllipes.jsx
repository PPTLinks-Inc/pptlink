import { useEffect, useState } from "react";
import Ellipse from "../../images/Ellipse.png";
import './anim.css'
export default function MovingEllipses() {
    const [ellipses, setEllipses] = useState([]);

    useEffect(() => {
        // Generate initial ellipses
        setEllipses(Array.from({ length: 4 }, (_, index) => createEllipse(index)));
        // Update ellipses position every 5 seconds
        const interval = setInterval(() => {
            setEllipses((prevEllipses) =>
                prevEllipses.map((ellipse) => updateEllipsePosition(ellipse))
            );
        }, 50000);

        return () => clearInterval(interval);
    }, []);
    const createEllipse = (id) => ({
        id,
        top: getRandomPosition(),
        left: getRandomPosition(),
        animationDelay: Math.random() * 5 + 's', // Random animation delay
    });

    const updateEllipsePosition = (ellipse) => ({
        ...ellipse,
        top: getRandomPosition(),
        left: getRandomPosition(),
    });

    const getRandomPosition = () => Math.floor(Math.random() * 90) + 'vh';

    return (
        <>
            {ellipses.map((ellipse) => (
                <div
                    key={ellipse.id}
                    className="ellipse-container"
                    style={{ top: ellipse.top, left: ellipse.left, animationDelay: ellipse.animationDelay }}
                >
                    <img
                        draggable="false"
                        loading="lazy"
                        src={Ellipse}
                        alt="Ellipse"
                    />
                </div>
            ))}
        </>
    );
}