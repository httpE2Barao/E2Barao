interface iResumeAbt {
  theme: string;
  language: string;
}

export const ResumeAbt = ( props:iResumeAbt ) => {
  return (
    <section id="resume-abt" className={`${props.theme==='dark' ? 'text-white' : 'text-black'}
    text-center px-4 py-10 pt-40 mx-auto max-w-[1750px]`}>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla, tempora corporis error fugit et quae odit illo accusamus delectus iste, ex eos unde eveniet aspernatur, voluptas laboriosam repellendus perferendis veritatis?
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla, tempora corporis error fugit et quae odit illo accusamus delectus iste, ex eos unde eveniet aspernatur, voluptas laboriosam repellendus perferendis veritatis?
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla, tempora corporis error fugit et quae odit illo accusamus delectus iste, ex eos unde eveniet aspernatur, voluptas laboriosam repellendus perferendis veritatis?
      </p>
    </section>
  )
}