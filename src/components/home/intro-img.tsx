import Image from "next/image"

const ImagemIntroducao = () => {
    const props = {
        marginLeft: "auto",
        maxWidth: "500px",
    }
    return (
        <Image style={props} src={"/images/img-dev-azul.png"} alt="Arte digital com um homem no computador" width={500} height={500}/>
    )
}
export default ImagemIntroducao;