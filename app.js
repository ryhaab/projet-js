let imgReference; // Variable pour stocker la référence à l'image

function verifierTailleImage(image) {
    const img = new Image();
    const canvas = document.getElementById("resultatCanvas");
    const ctx = canvas.getContext("2d");

    img.onload = function() {
        // Conservez les informations sur la taille d'origine
        const tailleOriginale = { largeur: img.width, hauteur: img.height };

        // Vérifiez si l'image est de dimension 512x512
        if (img.width === 512 && img.height === 512) {
            alert("L'image est de dimension 512x512.");
            console.log("L'image est de dimension 512x512.");

            // Affichez l'image sans la redimensionner
            canvas.width = 512;
            canvas.height = 512;
            ctx.drawImage(img, 0, 0, 512, 512);
            return;
        }
        alert("Votre image n'est pas de dimension 512x512. Elle sera redimensionnée.");
        console.log("Votre image n'est pas de dimension 512x512. Elle sera redimensionnée.");
        // Appliquez le redimensionnement initial au canvas
        const facteurRedimensionnement = Math.min(1, 512 / Math.max(img.width, img.height));
        canvas.width = img.width * facteurRedimensionnement;
        canvas.height = img.height * facteurRedimensionnement;

        // Dessinez un cercle de masquage
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();

        // Réaffichez l'image dans le canvas avec les dimensions d'origine
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Utilisation de la bibliothèque interact.js pour ajouter la fonctionnalité de redimensionnement
        interact(canvas).resizable({
            edges: { left: true, right: true, bottom: true, top: true }
        }).on('resizemove', function(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0);
            const y = (parseFloat(target.getAttribute('data-y')) || 0);

            // Met à jour la taille du canvas pendant le redimensionnement
            canvas.width = event.rect.width;
            canvas.height = event.rect.height;

            // Dessinez un cercle de masquage
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.clip();

            // Réaffichez l'image dans le canvas avec les dimensions d'origine
            ctx.drawImage(img, x, y, canvas.width, canvas.height);

            // Met à jour les données x, y pour la prochaine interaction
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        });

        // Enregistrez une référence à l'image pour l'utiliser plus tard
        imgReference = img;
    };

    img.src = URL.createObjectURL(image);
}


function redimensionnerA512x512() {
    const canvas = document.getElementById("resultatCanvas");
    const ctx = canvas.getContext("2d");

    // Vérifiez si l'image est déjà de dimension 512x512
    if (imgReference && imgReference.width === 512 && imgReference.height === 512) {
        console.log("L'image est déjà de dimension 512x512.");
        return;
    }

    // Vérifiez si l'image de référence est définie
    if (!imgReference) {
        console.log("Aucune référence d'image trouvée.");
        return;
    }

    // Sauvegardez l'état actuel du contexte
    ctx.save();

    // Redimensionnez le canvas à 512x512 pixels
    canvas.width = 512;
    canvas.height = 512;

    // Dessinez un cercle de masquage
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();

    // Réaffichez l'image dans le canvas avec les dimensions d'origine
    ctx.drawImage(imgReference, 0, 0, 512, 512);

    // Restaurez l'état précédent du contexte
    ctx.restore();

    console.log("L'image a été redimensionnée à 512x512 pixels.");
}
function masqueCirculaire(image) {
    const img = new Image();

    img.onload = function() {
        const canvas = document.getElementById("resultatCanvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        // Dessiner un cercle de masquage
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();

        // Dessiner l'image à l'intérieur du cercle
        ctx.drawImage(img, 0, 0, img.width, img.height);

        console.log("Masque circulaire appliqué.");
    };

    img.src = URL.createObjectURL(image);
}

function ambianceJoyeuse(image) {
    const img = new Image();

    img.onload = function() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const rouge = data[i];
            const vert = data[i + 1];
            const bleu = data[i + 2];

            if (rouge < 100 && vert < 100 && bleu < 100) {
                data[i] += 50;
                data[i + 1] += 50;
                data[i + 2] += 50;
            }
        }

        ctx.putImageData(imageData, 0, 0);

        const imageModifiee = canvas.toDataURL();
        console.log("Ambiance joyeuse des couleurs appliquée.");
        console.log("Nouvelle image: ", imageModifiee);
    };

    img.src = URL.createObjectURL(image);
}

function convertirEnObjet(image) {
    const img = new Image();

    img.onload = function() {
        const objetImage = {
            taille: { largeur: img.width, hauteur: img.height },
            type: "PNG",
            // Autres informations importantes
        };

        console.log(objetImage);
    };

    img.src = URL.createObjectURL(image);
}

function traiterImage() {
    const inputImage = document.getElementById("choisirImage");
    const selectedImage = inputImage.files[0];

    if (selectedImage) {
        // Vérifier la taille de l'image
        verifierTailleImage(selectedImage);
        redimensionnerA512x512(); // Appel automatique de la fonction de redimensionnement
        masqueCirculaire(selectedImage);
        ambianceJoyeuse(selectedImage);
        convertirEnObjet(selectedImage);
    } else {
        console.log("Aucune image sélectionnée.");
    }
}
