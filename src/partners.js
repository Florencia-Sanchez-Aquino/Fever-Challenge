// Aca se genera la funcion que genera el html para la sección de Partners que despues se la llama en el main.js

export const addPartners = (partners) => {
    const partnersContent = document.getElementById('partners');
    partnersContent.innerHTML = "";

    //Busca el contenido otorgado por el archivo .json
    partners.forEach(partner => {
        let contentPartners = document.createElement('div');
        contentPartners.className = 'partners-content';
        contentPartners.innerHTML = ` 
             <a href="${partner.partnerUrl}" target="_blank">
             <img class="img-fluid" alt="${partner.partnerName}" src="${partner.partnerImage}" >
            </a>
           `;

        partnersContent.append(contentPartners);

    });
};

