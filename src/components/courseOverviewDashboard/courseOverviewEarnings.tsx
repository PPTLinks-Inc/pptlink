import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import CourseOverviewRoot from "./courseOverviewRoot";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaAngleDown } from "react-icons/fa6";
import settings_svg from "/settings.svg";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// const ViewStudents = Array.from({ length: 16 }, (_, i) => i + 1);
const messagesTypeArray = ["All Messages", "Students", "Tutors"];
export default function CourseOverviewEarnings() {
  const { bg, text, border } = useTheme();
  const [view, setView] = useState({
    listOfAllStudents: true,
    studentTutorChats: false,
    listOfCourseMessages: false,
    courseMessage: false
  });
  const [messageView, setMessageView] = useState({
    view: false,
    value: messagesTypeArray[0]
  });

  const handleMessageView = (currentView: string): string => {
    setMessageView((prev) => ({
      ...prev,
      view: !prev.view,
      value: currentView
    }));
    setView({
      listOfAllStudents: true,
      studentTutorChats: false,
      listOfCourseMessages: false,
      courseMessage: false
    });

    return currentView;
  };

  return (
    <CourseOverviewRoot>
      <ScrollArea
        className={`wrapper relative w-full grid grid-rows-[auto_1fr] grid-cols-1 gap-2 overflow-hidden [&_*::-webkit-scrollbar]:hidden! [-ms-overflow-style:none]! [scrollbar-width:none]!`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          height: "calc(100vh-144px)"
        }}
      >
        {/* header section */}
        <header
          className={`w-fit h-fit mb-4 flex justify-start items-center gap-4 sticky top-0 !bg-black`}
        >
          <div className="relative w-fit h-fit">
            <button
              type="button"
              onClick={() =>
                setMessageView((prev) => ({ ...prev, view: !prev.view }))
              }
              className={`flex items-center justify-start gap-4 h-10 px-2 ${bg} ${text} text-sm ${border} border-[0.1px] rounded-md cursor-pointer`}
            >
              <img src={settings_svg} alt={settings_svg} />
              <span>{messageView.value}</span>
              <span>
                <FaAngleDown />
              </span>
            </button>

            {/* Hidden dropdown - remove or fix display */}
            <div
              className={`${!messageView.view ? "hidden" : "flex absolute z-10 top-[2.7rem] left-0"} flex-col justify-start items-center gap-[1px] w-full h-fit ${bg} ${text} text-sm ${border} border-[0.1px] p-[0.1rem] rounded-md cursor-pointer`}
            >
              {/* dropdown content */}
              <button
                type="button"
                title="set message view"
                onClick={() => handleMessageView(messagesTypeArray[0])}
                className={`w-full h-full ${text} text-sm text-left border-[0.1px] border-gray-600/65 rounded-md outline-none py-2 px-2 ${messageView.value === messagesTypeArray[0] && "!bg-[#FFFFF0] !text-black"}`}
              >
                All Messages
              </button>
              <button
                type="button"
                title="set message view"
                onClick={() => handleMessageView(messagesTypeArray[1])}
                className={`w-full h-full ${text} text-sm text-left border-[0.1px] border-gray-600/65 rounded-md outline-none py-2 px-2 ${messageView.value === messagesTypeArray[1] && "!bg-[#FFFFF0] !text-black"}`}
              >
                Students
              </button>
              <button
                type="button"
                title="set message view"
                onClick={() => handleMessageView(messagesTypeArray[2])}
                className={`w-full h-full ${text} text-sm text-left border-[0.1px] border-gray-600/65 rounded-md outline-none py-2 px-2 ${messageView.value === messagesTypeArray[2] && "!bg-[#FFFFF0] !text-black"}`}
              >
                Tutors
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              setView({
                listOfAllStudents: false,
                studentTutorChats: false,
                listOfCourseMessages: true,
                courseMessage: false
              })
            }
            className={`flex items-center justify-center h-10 px-6 bg-[#FFFFF0] text-black text-sm border-none rounded-md cursor-pointer`}
          >
            Course Messages
          </button>
        </header>
        <ScrollArea className={`scrollbar-hide block w-full h-[calc(100vh-184px)]`}>
          {/* list of all students */}
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
            fuga eos sint quia ullam temporibus incidunt fugit. Ipsam dicta
            eveniet quis quidem perferendis placeat repudiandae eaque. Ea
            dolores atque, dignissimos optio quas cumque neque quos porro
            blanditiis molestias perspiciatis necessitatibus nostrum repellendus
            accusantium, beatae quod! Id sequi quibusdam similique aliquam
            architecto aspernatur repellendus sit facilis cumque dicta debitis,
            cum tenetur, recusandae blanditiis? Neque commodi debitis nulla
            adipisci iusto beatae atque quae fugiat similique omnis rerum minima
            magni, eligendi maxime aliquam, nemo placeat provident repellendus
            doloremque obcaecati? Corporis eum unde delectus repellendus, magni
            aut accusamus ipsam suscipit ipsa. Nam facere esse laboriosam
            obcaecati voluptatibus voluptas voluptates, officia ad corrupti
            quibusdam quia quas odio et harum quam labore in tempora
            consequuntur omnis placeat possimus cum nesciunt asperiores. Ratione
            nostrum officiis porro dolore quidem quo, autem molestias minima
            quod! Aut enim repellat soluta, fuga dignissimos reprehenderit
            fugiat consectetur ea corporis voluptatum tenetur voluptatibus nulla
            ipsam harum quasi maxime rem facere amet! Reiciendis inventore
            repudiandae officiis, minus est dignissimos eius id suscipit a
            velit? Facere, enim dolor reiciendis inventore recusandae suscipit
            natus deleniti ipsam a ab at fuga amet dolore labore dolorum qui ad
            veritatis quo quam? Ab illum error ipsum dolore pariatur cupiditate
            deserunt molestias facere, obcaecati aliquam at asperiores
            doloremque! Doloribus ea, maxime iusto dolore repellendus deleniti
            at assumenda! Ab accusantium ex repudiandae, deserunt impedit modi
            autem ducimus velit nam, temporibus, eius eveniet hic cupiditate rem
            aliquam. Sunt doloribus accusantium id. Sequi sit consequatur hic
            voluptas fuga facilis sapiente! Quas repellat ipsam explicabo
            reprehenderit sequi suscipit enim, minima officiis porro magnam
            voluptas consectetur iste, iusto tenetur, praesentium quia
            recusandae excepturi et sed optio numquam doloremque commodi. Odit
            eveniet soluta aliquam corrupti nihil rem architecto. Nobis, sit
            omnis eaque iusto ab maxime accusamus eius nostrum nemo laborum
            delectus animi veritatis rerum expedita dolorum ratione, quae
            cupiditate consequatur quaerat? Ipsum ut in suscipit sunt non
            incidunt, accusantium nam exercitationem sapiente provident est
            veritatis, quae tenetur impedit illo inventore iure voluptates
            debitis quod ipsa rerum consequatur! Inventore ipsum nisi laudantium
            impedit soluta itaque ut qui cupiditate deleniti reiciendis. Aperiam
            accusantium eveniet est adipisci deleniti omnis, officiis maxime
            corporis. Deserunt quae officiis id necessitatibus aperiam
            asperiores dignissimos laborum consequatur nesciunt, dolores culpa,
            eos est omnis debitis? Earum cum soluta repudiandae? Natus non
            explicabo eveniet temporibus sunt! Dolorum, facilis quod soluta,
            quaerat, dolorem quia eius commodi ab veniam accusantium earum unde
            impedit! Ducimus porro voluptatibus optio animi incidunt quas qui ab
            assumenda maxime eveniet eos rem at perspiciatis nobis, vero, beatae
            vitae facere, consequatur omnis commodi facilis? Obcaecati, minima
            repellendus? Molestiae veniam sapiente repudiandae eius accusamus
            itaque fugiat ipsum deleniti doloribus mollitia? Consequatur culpa
            amet rem minus quas voluptatibus ex commodi distinctio eos, repellat
            tempora! Numquam inventore qui saepe laboriosam non sapiente a nam,
            itaque ullam modi omnis similique iure error quis facere vero!
            Temporibus, aliquid. Aliquid soluta incidunt beatae dignissimos,
            temporibus blanditiis iste commodi vero, tenetur reprehenderit
            voluptatem itaque unde laudantium tempore reiciendis fugiat
            provident. Omnis accusantium sint necessitatibus, doloremque
            molestias nam ipsam excepturi et aperiam natus non aliquid nulla
            impedit at, ipsa similique voluptatibus culpa rem iusto officia
            dolores minima porro suscipit! Aut aliquid beatae dicta laborum
            sapiente nam hic deserunt animi perspiciatis est similique eveniet,
            molestiae dolorum corrupti reiciendis ducimus maiores illo vero
            debitis? Quam cumque vel, dolor sunt suscipit neque minima dicta,
            id, tempora rem praesentium doloremque esse. Praesentium, fugiat
            consequatur. Autem minima reiciendis cumque inventore animi
            laboriosam maiores voluptates soluta laudantium iure, deleniti
            veritatis voluptatem quos magni odit eveniet placeat blanditiis
            fuga. Amet iure modi distinctio sapiente a dolores, laboriosam ipsa,
            vel architecto autem facilis exercitationem, impedit perspiciatis?
            Illo error autem recusandae voluptas dolorum quod delectus culpa
            magnam voluptatem nobis cupiditate dolore possimus praesentium
            nostrum minima debitis, in, aliquid sequi quia perferendis
            accusantium. Veritatis ratione quasi asperiores, recusandae facilis
            nam quibusdam deserunt minima magnam ex distinctio a est ipsa
            laboriosam quia quod deleniti sed labore! Eaque voluptates sed,
            voluptatem distinctio libero cum iure nihil error repellendus
            soluta? Accusamus quos facere ut porro ipsum. Nemo quod ad, facilis
            architecto fuga veritatis ex sint odio rerum odit nihil nam, fugit
            magni vitae. Enim expedita accusantium illo nostrum animi, quos, a
            facere perferendis unde repellendus autem inventore ut et
            consequatur dicta earum architecto quidem rerum? Dolor rerum et
            placeat nulla aperiam quod explicabo nesciunt dolore error, nam
            fuga, tenetur ipsam asperiores provident a numquam optio eveniet cum
            est esse, animi saepe ipsa odio? Molestiae mollitia totam ad.
            Commodi eligendi inventore corporis. Rem non explicabo quae dolor
            officiis dicta quidem quam quo repudiandae est architecto,
            exercitationem debitis quod earum consequatur, fugiat eaque
            molestiae atque ratione officia, qui velit. Ab atque, animi totam
            fugiat, illum quos maiores libero sint tempora pariatur
            necessitatibus odit placeat rerum assumenda, quasi delectus dolor
            similique officiis recusandae maxime error dolorum nostrum at! Magni
            dicta enim blanditiis facere eum. Qui sed aperiam voluptatem sunt
            consequatur a dolorum molestiae nisi natus asperiores! Doloremque
            sint molestias, similique et quos deleniti molestiae dicta explicabo
            blanditiis! Odit repellat maiores autem aperiam, possimus tempore
            magnam ex architecto a reiciendis facilis, quae ea iure corporis et
            nemo voluptatum dignissimos quam minus commodi quisquam sequi,
            quidem atque? Fugit, architecto officiis suscipit molestiae in
            libero nam maiores quasi autem tenetur debitis exercitationem, iusto
            minima veniam sapiente provident numquam! Asperiores, et ipsum. Non
            dolorem dicta pariatur architecto rem voluptatem, quod libero
            laborum recusandae quos eum, sapiente est! Accusantium molestiae
            minus aspernatur odit, culpa sint autem reiciendis optio eaque iusto
            sapiente blanditiis eius alias mollitia saepe aperiam, obcaecati
            repellat id atque nam cumque qui quos magni ut. Animi reprehenderit,
            voluptate similique minima, laudantium debitis id soluta autem quas
            quis vitae voluptatibus harum, tempore inventore voluptates hic. Et
            accusantium veniam at distinctio nihil a deleniti! Ipsum quos qui
            harum facilis, ex suscipit fugiat, fugit sapiente reprehenderit,
            veniam ipsam perspiciatis. Illo dolorum voluptates optio debitis
            omnis amet! Illum, nulla. Nam harum id blanditiis a. Porro,
            perspiciatis ea. Beatae quam, deleniti alias architecto cupiditate
            ipsam non voluptatem. Optio, ad enim! Molestias totam quos rem
            facere. Voluptatibus doloremque minima incidunt rerum corporis
            nesciunt praesentium modi placeat sequi.
          </p>
        </ScrollArea>
      </ScrollArea>
    </CourseOverviewRoot>
  );
}
