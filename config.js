// CONFIGURACIÓN CENTRALIZADA DE ASSETS Y CONTACTO
// El cliente podrá reemplazar estos URLs en el código fácilmente.

const SITE_CONFIG = {
  // --- IDENTIDAD VISUAL Y LOGOS ---
  logos: {
    logoPrincipalHeader: "imagenes/Logo_Transparente.png", 
    logoFooter: "imagenes/Logo_Transparente.png",            
    favicon: "imagenes/pluma.png",              
    isotipoPluma: "imagenes/pluma.png"            
  },

  // --- IMÁGENES Y MEDIA DE PRODUCTOS ---
  media: {
    producto_3kg: "imagenes/producto_3kg.png",
    producto_4kg: "imagenes/producto_4kg.jpeg",            
    heroBannerBg: "imagenes/brasas.png", 
    secadoHornoVideo: "imagenes/horno.mp4",     
    nosotrosBanner: "imagenes/bosque.png"
  },

  // --- INFORMACIÓN DE CONTACTO Y REDES SOCIALES ---
  contactInfo: {
    telefonoContacto: "+54 9 2241 692262 / 67226",             
    emailContacto: "gorositoemprendimientos@gmail.com",
    direccion: "Chascomús, Prov. de Buenos Aires, Argentina",
    redesSociales: {
      instagram: "https://www.instagram.com/pirobrik",
      tiktok: "https://www.tiktok.com/@pirobrik",
      facebook: "https://www.facebook.com/pirobrik"
    }
  },

  // --- ENDPOINTS Y PASARELAS ---
  api: {
    // REEMPLAZAR ESTA URL CON LA QUE TE DIO GOOGLE APPS SCRIPT AL PUBLICAR:
    googleSheetsEndpoint: "https://script.google.com/macros/s/AKfycbxxPahWfHugr4nhOX7xvcXSPRtqIUPcFSX_-Oool1RdB27FHJ4Lr38VlNXhi12bIUle/exec",
    mercadoPagoPublicKey: "APP_USR-4a0d8c7a-9b93-416b-a8e6-f1a697c2fcc8"
  }
};
