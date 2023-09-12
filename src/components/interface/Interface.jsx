import './interface.css';
import { FaUser, FaMagnet, FaAndroid, FaBars } from 'react-icons/fa';
import { useState } from 'react';
import Header from './layout/Header';

function Interface() {
  const [enter, setEnter] = useState(false);
  const handleMouseEnter = (e) => {
    e.target.classList.add('hovered');
  };
  const handleMouseLeave = (e) => {
    e.target.classList.remove('hovered');
  };

  return (
    <main className=' min-h-screen overflow-hidden  relative bg-white '>
      <Header />
      {/* navigation */}
      <div className=' bg-gray-200 left-0  h-full w-60  fixed transition-all duration-500 overflow-hidden '>
        <ul className='nav-item pl-6 py-8 w-full absolute top-0 left-0'>
          <li
            className='relative w-full'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href='/'
              className='nav-side flex items-center gap-4 p-4  rounded-l-full relative font-semibold hover:bg-white hover:text-blue '
            >
              <span className='relative block min-[60px]'>
                {' '}
                <FaUser className='text-2xl' />
              </span>
              <span> Brand Name</span>
            </a>
          </li>
          <li
            className='relative w-full'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href='/'
              className='nav-side flex items-center gap-4 p-4  rounded-l-full relative font-semibold hover:bg-white hover:text-blue'
            >
              <span className='relative block min-[60px]'>
                {' '}
                <FaMagnet className='text-2xl' />
              </span>
              <span> Magnet</span>
            </a>
          </li>
          <li
            className='relative w-full'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href='/'
              className='nav-side flex items-center  p-4 gap-4 rounded-l-full relative font-semibold hover:bg-white hover:text-blue '
            >
              <span className='relative block min-[60px]'>
                {' '}
                <FaAndroid className='text-2xl' />
              </span>
              <span> Adroid</span>
            </a>
          </li>
        </ul>
      </div>
      {/* body */}
      <section className='main-body w-full bg-white max-h-screen overflow-y-scroll rounded-2xl mb-4'>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium
        aperiam vel porro magni quia reiciendis beatae, quos adipisci quidem,
        temporibus necessitatibus velit, sed maxime odit quis quaerat voluptatum
        aspernatur sapiente. Lorem ipsum dolor sit amet, consectetur adipisicing
        elit. Consequuntur temporibus accusantium optio ad, illo ab laborum
        deleniti. Rerum facere exercitationem, accusantium magnam dignissimos
        repudiandae quisquam tenetur tempore distinctio nam ullam eveniet
        voluptatem quam doloremque. Ipsam nobis alias labore quidem mollitia
        cupiditate atque? Beatae, eaque reiciendis dolore fuga provident, natus
        minima culpa id quos animi earum iure sed, at saepe? Voluptas nulla
        nihil voluptate ducimus sint vero aliquam? Ullam nulla dicta ratione
        mollitia voluptate itaque saepe recusandae quia eum neque omnis minus
        ducimus rerum quaerat velit autem exercitationem, impedit rem commodi
        quam maxime maiores aliquam dolore. Hic reiciendis sunt enim
        exercitationem sint eum esse quidem nulla quas ipsum distinctio ipsam
        quos, neque non praesentium velit ullam similique iusto voluptate minima
        fugit ea, dolores a ipsa. Temporibus quam earum voluptatem, dicta autem
        facilis adipisci omnis doloremque alias veniam natus mollitia
        perspiciatis aut iste, porro incidunt eius odit accusamus id, provident
        nulla illo. Animi, deserunt. Ratione harum, delectus officiis nesciunt
        expedita amet fugit consectetur veritatis non eveniet consequuntur
        architecto atque repellat, modi ipsum quod voluptatum ea repellendus quo
        quae nam! Dolor quam magnam, corrupti eveniet nostrum rerum, laboriosam,
        eaque quos cumque reprehenderit quo! Perspiciatis dignissimos tenetur
        aperiam dolor ducimus a fugiat sit vel velit magnam obcaecati quis,
        placeat veritatis in. Nam mollitia quae laudantium eum. Inventore
        obcaecati reprehenderit officia. Vitae quia inventore nulla illo
        distinctio odit id. Eius totam ullam in magnam, incidunt illum odit,
        consectetur asperiores deserunt maxime aut possimus nam sint nulla
        veritatis. Deserunt est ab vitae natus vel facere temporibus adipisci
        unde voluptatibus magnam? Deserunt doloremque repellendus incidunt
        voluptatum harum beatae hic porro voluptate nihil ab unde dignissimos
        sed suscipit quod ullam, delectus recusandae repellat modi eaque impedit
        nobis vitae amet sit! A fuga pariatur hic totam facilis corrupti maiores
        provident voluptate numquam delectus ut illum accusamus magnam autem
        similique, suscipit odio eius nostrum esse impedit neque tempora magni?
        Nisi natus reprehenderit, saepe illo aspernatur dolores, ullam quo
        veritatis consequuntur unde nihil itaque labore! Voluptatem rem ipsam
        tenetur est quaerat sint, earum sequi dolore? Vero aperiam aliquam
        dolorem tempore, saepe cum molestias nisi commodi, tempora atque in
        dolores illum voluptatibus iure pariatur repellendus? Dolores voluptatum
        nemo perspiciatis aliquam ad architecto deleniti hic temporibus iste,
        est ullam saepe praesentium expedita tempore, quidem cum maxime
        voluptates, quaerat autem unde? Ipsam, quibusdam et minima voluptates
        enim unde repellat, dolore aut blanditiis impedit voluptatibus officiis
        libero porro modi pariatur a at perspiciatis. Tempora, aut. Lorem ipsum
        dolor sit, amet consectetur adipisicing elit. Doloremque quaerat amet
        dolorum corrupti molestiae obcaecati expedita delectus temporibus animi!
        Dolor ratione, unde rem consectetur placeat sint, reiciendis obcaecati
        et doloremque quis fugit sequi quam aut, sit dolore. Eum non
        consequuntur consequatur perspiciatis. Doloremque ab iure, laudantium,
        veniam libero excepturi exercitationem, amet molestiae voluptas omnis
        numquam similique assumenda explicabo. Deleniti provident rem blanditiis
        alias nam quibusdam iusto officia illo a eum voluptatum corrupti,
        veritatis obcaecati fuga possimus beatae eveniet distinctio quasi
        repudiandae voluptates ducimus, perferendis velit. Eveniet, ut impedit
        mollitia quidem itaque placeat facilis, eius temporibus numquam
        accusantium, reiciendis qui officiis aut. Fugiat maxime nobis veritatis
        eveniet dolorum cupiditate. Tempora corrupti, nostrum veritatis
        asperiores et vitae dolor aperiam nam, distinctio saepe, facere atque.
        Placeat minus earum nihil, illo atque dolore tempora odit incidunt
        ipsum, quam quidem debitis quod sapiente perferendis itaque, ducimus a
        doloribus eveniet beatae odio necessitatibus modi impedit veritatis!
        Dolores distinctio sed alias quasi ducimus totam, sint porro recusandae
        libero veniam quia quod, dolorum inventore omnis laborum asperiores?
        Praesentium, error magnam laboriosam quisquam blanditiis non, corrupti
        beatae, quo cupiditate assumenda esse voluptas rem? Vitae illum ratione
        voluptates soluta, placeat, fugiat atque repellendus incidunt sunt
        expedita cupiditate dolorem reiciendis maxime quos similique dignissimos
        enim tempore tenetur aut pariatur consectetur. Maxime aperiam officiis
        reiciendis suscipit molestiae sapiente quod tempore nostrum quidem quas
        dolore nisi aliquam quia cupiditate earum, doloremque iste quo
        distinctio. Quas tempora, aperiam itaque dicta enim sapiente alias rem
        vero assumenda veritatis nostrum labore non corrupti cumque distinctio
        aliquid modi voluptate nisi, ullam consequuntur sit obcaecati. Ducimus
        dolorem nisi quod ad dolores necessitatibus maxime laudantium
        distinctio, praesentium mollitia earum laboriosam facilis ut. Dolore
        expedita laborum accusamus doloremque beatae non earum. Ipsa quasi
        sapiente maxime praesentium repudiandae voluptates minus asperiores
        adipisci eos, assumenda, earum reiciendis rerum vel distinctio quisquam
        corporis, unde odio consequuntur doloremque aperiam? Nulla culpa, enim
        velit perferendis magni illo atque eligendi nam distinctio vitae nihil
        ea quasi ad delectus maxime in quidem sit temporibus eum sint sequi
        architecto. Beatae tempore dolore blanditiis eius cum dolor incidunt,
        eligendi, assumenda quam ad animi autem veritatis unde similique
        voluptates expedita ipsum! Dolorem debitis cupiditate ipsum molestiae
        fuga ea reiciendis quis iusto! Quidem saepe nostrum molestiae laboriosam
        amet asperiores ipsum, nam consequatur rem eaque, dolores tenetur aut
        eligendi odio. Tempora rem aliquam quibusdam, officia quisquam ea id
        amet, dolorum ipsum corrupti, dicta corporis odio sint temporibus iste
        nobis quo nulla at fugit. Ut perferendis fugiat iure vitae? Totam quia
        quibusdam voluptatem, unde nobis corporis ipsam nesciunt? Dicta amet
        repellat explicabo aliquam voluptatum officiis laudantium ipsam tenetur
        cupiditate, incidunt accusamus nihil quia veniam nobis maxime culpa
        dolor architecto in? Ab at suscipit quia quaerat, atque provident id.
        Quam et provident deserunt, sequi blanditiis nesciunt quos id modi saepe
        ipsum commodi pariatur officia necessitatibus iste ex harum rem porro
        possimus dignissimos odio assumenda omnis dolor architecto sunt! Magni
        sint provident voluptas? Optio est at fuga reiciendis, praesentium ea
        illo sint quae possimus illum facere temporibus quidem consequatur
        aperiam eos a sapiente ipsa cupiditate fugit. Nesciunt et reiciendis
        laudantium iure dolorum dignissimos, molestias deserunt ullam doloribus
        vel deleniti repellat. Alias atque sit laudantium, enim in corrupti
        nostrum ratione distinctio? Minus id error animi molestiae unde ad est
        quos corrupti laudantium saepe, iste voluptatibus quibusdam amet
        deleniti labore aliquam voluptates magni, accusamus iure sunt, in soluta
        omnis! Doloribus molestias expedita minus earum a, veritatis delectus!
        Nisi dolorem, modi ullam pariatur tempora qui quae accusantium, autem
        consequuntur tenetur reiciendis. Perspiciatis iure quidem impedit
        consequuntur, facilis fugit doloremque blanditiis beatae, culpa laborum
        consequatur nostrum, recusandae nulla voluptatum ipsa quae aliquid.
        Accusantium quae, sed nobis eveniet labore quibusdam reiciendis nemo
        omnis, quo quia temporibus nihil dolorum doloremque eos harum.
        Consequatur nesciunt voluptates accusamus ipsa, eveniet numquam tempore
        neque aliquid ab dolor repellendus aspernatur. Pariatur omnis adipisci
        quod ad suscipit, quibusdam neque corporis quasi ullam ducimus inventore
        cum quia sunt libero sit modi iusto cumque atque voluptatum dolorem
        explicabo beatae consequatur deserunt? Incidunt cumque dolorum, ea eos
        cupiditate quo! Ab consequatur ducimus expedita illum, tenetur, in
        aliquam perspiciatis rem error omnis, voluptatibus soluta qui similique
        pariatur amet facilis! Animi, nam magni delectus quia atque
        necessitatibus tempora culpa suscipit deserunt tenetur enim, in ducimus
        distinctio ut repellendus, libero magnam dolorem nesciunt minima itaque
        dolore reprehenderit. Ad eius perferendis incidunt, debitis aliquam
        porro officiis magni libero repellat nobis quae dicta itaque. Ipsum
        officiis error labore? Cumque error ad quasi nostrum repellat doloribus
        eius voluptatum incidunt pariatur, dolorum tempora illo perspiciatis
        omnis minima. Enim dolores maiores eius voluptate, ex tempora magnam
        ipsum obcaecati temporibus eligendi fuga quisquam sit nam, cupiditate
        praesentium expedita possimus. Laborum vel dolores quis ducimus enim
        excepturi soluta fugit illo animi vero iste accusantium rerum sed magnam
        reprehenderit alias ad voluptatem veritatis voluptates, exercitationem
        autem! Necessitatibus iure ab architecto a odio reiciendis dolores
        accusamus velit saepe aliquam, adipisci quo perspiciatis quidem itaque!
        Repellendus inventore recusandae possimus! Repellendus voluptatibus nam
        iusto deleniti rem voluptas praesentium reiciendis minus. Consequatur,
        vero quaerat minus aliquid nemo corporis a facere repudiandae dolore
        optio consectetur vel, modi, reiciendis molestiae nostrum eos id minima
        alias voluptate aperiam? Unde quo odio in saepe necessitatibus, harum ut
        quis temporibus explicabo eaque, aliquam eius? Quae veniam quidem
        aperiam iusto earum debitis neque maiores corrupti quaerat pariatur
        eveniet rerum itaque, explicabo consectetur facilis voluptatibus ad
        similique fugit a eius animi laboriosam repellendus. Optio autem magni
        maiores amet illo labore distinctio ad, ipsam accusamus omnis? Officia,
        suscipit? Harum ea necessitatibus deleniti totam sapiente? Optio minima
        culpa, omnis assumenda, eius doloribus accusamus commodi dicta,
        distinctio cum aperiam. In ipsum ullam totam fugiat cum beatae tempore
        nobis consectetur reiciendis similique nesciunt, dolore deserunt qui?
        Enim soluta culpa voluptatibus magni quis suscipit minima, modi iusto
        veniam similique libero! Perferendis atque quibusdam, deserunt
        cupiditate odit ab. Rem ipsum adipisci maiores illum sequi sit. Neque,
        sequi? Ipsam magni beatae quidem aut impedit perferendis illum earum!
        Adipisci suscipit ducimus totam doloribus assumenda. Aliquid, nostrum
        odio dolores quo quis tenetur harum aliquam ullam, asperiores voluptate
        molestias neque amet animi soluta earum rem corrupti voluptatum iste,
        fuga sequi quae.
      </section>
      {/* navigation */}
      <div className=' bg-gray-200 right-0  h-full w-20  fixed transition-all duration-500 overflow-hidden '>
        <ul className='nav-item pl-6 py-8 w-full absolute top-0 right-0'>
          <li
            className='relative w-full'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href='/'
              className='flex items-center gap-4 p-4  rounded-l-full relative font-semibold hover:bg-white hover:text-blue '
            >
              <span className='relative block min-[60px]'>
                {' '}
                <FaUser className='text-2xl' />
              </span>
            </a>
          </li>
          <li
            className='relative w-full'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href='/'
              className='flex items-center gap-4 p-4  rounded-l-full relative font-semibold hover:bg-white hover:text-blue'
            >
              <span className='relative block min-[60px]'>
                {' '}
                <FaMagnet className='text-2xl' />
              </span>
            </a>
          </li>
          <li
            className='relative w-full'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href='/'
              className=' flex items-center  p-4 gap-4 rounded-l-full relative font-semibold hover:bg-white hover:text-blue '
            >
              <span className='relative block min-[60px]'>
                {' '}
                <FaAndroid className='text-2xl' />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
}

export default Interface;
