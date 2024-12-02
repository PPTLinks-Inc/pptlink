import { useRef, useEffect } from "react";

export default function CodeTest() {
    const scrollRefTwo = useRef(null);

    const scrollCardsTwo = (direction) => {
        const container = scrollRefTwo.current;
        if (!container) return;

        const cardWidth = container.children[0]?.offsetWidth || 0;
        const currentScroll = container.scrollLeft;

        const newScrollPosition = direction
            ? currentScroll - cardWidth
            : currentScroll + cardWidth;

        container.scrollTo({
            left: newScrollPosition,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const container = scrollRefTwo.current;

        const handleScroll = () => {
            if (!container) return;

            const containerWidth = container.offsetWidth;
            const centerPosition = container.scrollLeft + containerWidth / 2;

            const cards = [...container.children];
            let closestCard = null;
            let closestDistance = Infinity;

            cards.forEach((card) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const distance = Math.abs(centerPosition - cardCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestCard = card;
                }
            });

            if (closestCard) {
                container.scrollTo({
                    left: closestCard.offsetLeft - containerWidth / 2 + closestCard.offsetWidth / 2,
                    behavior: "smooth",
                });
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="your-component-class bg-white h-screen">
            <div className="_hidden flex justify-end items-center gap-5">
                <button onClick={() => scrollCardsTwo(true)}>Left</button>
                <button onClick={() => scrollCardsTwo(false)}>Right</button>
            </div>
            <div
                ref={scrollRefTwo}
                className="snap_scrolling container flex gap-8 h-fit overflow-x-auto overflow-y-hidden pr-2 pb-6 mb-6"
                style={{ scrollBehavior: "smooth" }}
            >
                {Array.from({ length: 10 }, (_, i) => (
                    <div
                        key={i}
                        className="card-class min-w-[18rem] grow-0 shrink-0 basis-[15rem] bg-black text-white"
                    >
                        Card {i + 1}
                    </div>
                ))}
            </div>
        </div>
    );
};




