/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useEffect } from "react";
import "./about.css";

const teams = [
  { member: "1", expand: true },
  { member: "1", expand: false },
  { member: "1", expand: true },
  { member: "1", expand: true },
  { member: "1", expand: true },
  { member: "1", expand: false },
  { member: "1", expand: true },
  { member: "1", expand: false },
];

const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const About = () => {
  // useEffect(() => {
  //   const timeout = setTimeout(() => {}, 4000);

  //   return () => clearTimeout(timeout);
  // }, []);

  const [teamMembers, setTeamMembers] = useState(teams);

  useEffect(() => {
    const timer = setInterval(() => {
      let expandedCount = 0;
      const shuffledMembers = shuffleArray(teamMembers);

      const updatedMembers = shuffledMembers.map((member, index) => {
        if (expandedCount < 3 && member.expand === false) {
          expandedCount++;
          return { ...member, expand: true };
        } else {
          return { ...member, expand: false };
        }
      });

      setTeamMembers(updatedMembers);
    }, 4000); // Adjust the interval as needed

    return () => clearInterval(timer);
  }, [teamMembers]);

  return (
    <main>
      <div
        id="grid"
        className="grid grid-cols-6 grid-rows-6 grid-flow-dense gap-2 h-screen w-screen transition-all duration-200 bg-yellow-300 px-4"
      >
        {teamMembers.map((team, i) => {
          console.log({ team });
          return (
            <div
              id="left"
              key={i}
              className={`col-span-2 aspect-auto row-span-1 ${
                team.expand && "col-span-3 row-span-3"
              } border border-green-500 transition-all duration-300`}
            >
              <img className="w-full h-full object-cover" />
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default About;
