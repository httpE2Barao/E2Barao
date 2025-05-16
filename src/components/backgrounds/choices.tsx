import { useEffect, useState } from "react";
import { Button } from "../buttons";

interface iChoicesContainer {
  theme: string;
  language: string;
  handleClick: (targetId: string) => void;
}

const choice = ["Profissional", "Professional", "Pessoal", "Personal"];

export const ChoicesContainer = (props: iChoicesContainer) => {
  const [selected, setSelected] = useState<string>(""); // Inicialmente vazio

  useEffect(() => {
    // Configura o estado inicial para "Profissional"
    setSelected("#professional");
  }, []); // Executa apenas uma vez no carregamento

  return (
    <section className="mb-20 flex flex-col gap-5 items-center justify-around sm:gap-10">
      {/* Botões de Seleção */}
      <span className="flex gap-10 xl:gap-20 text-2xl">
        {/* Botão Profissional */}
        <Button
          index={0}
          text={props.language === "pt-BR" ? choice[0] : choice[1]}
          theme={props.theme}
          isSelected={selected === "#professional"}
          onClick={() => {
            setSelected("#professional"); // Atualiza o estado para "Profissional"
            props.handleClick("#professional"); // Executa lógica adicional
          }}
        />

        {/* Botão Pessoal */}
        <Button
          index={1}
          text={props.language === "pt-BR" ? choice[2] : choice[3]}
          theme={props.theme}
          isSelected={selected === "#personal"}
          onClick={() => {
            setSelected("#personal"); // Atualiza o estado para "Pessoal"
            props.handleClick("#personal"); // Executa lógica adicional
          }}
        />
      </span>

      {/* Renderização Condicional dos Componentes */}
      <div className="w-full mt-10">
        {/* {selected === "#professional" && (
          <div id="professional">
            <h2 className="text-center font-bold text-2xl">
              {props.language === "pt-BR"
                ? "Componente Profissional"
                : "Professional Component"}
            </h2>
            <p>
              {props.language === "pt-BR"
                ? "Aqui vai o conteúdo profissional."
                : "Professional content goes here."}
            </p>
          </div>
        )} */}

        {selected === "#personal" && (
          <div id="personal">
            <h2 className="text-center font-bold text-2xl">
              {props.language === "pt-BR"
                ? "Componente Pessoal"
                : "Personal Component"}
            </h2>
            <p>
              {props.language === "pt-BR"
                ? "Aqui vai o conteúdo pessoal."
                : "Personal content goes here."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
