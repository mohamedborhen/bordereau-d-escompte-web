const tauxEscompte = 8;
const tauxProportionnel = 0.7;
const tauxIndependant = 0.3;

function banqueDomiciliatrice(banque, lieu) {
    banque = banque.toUpperCase();
    lieu = lieu.toUpperCase();
    if (banque !== "BIAT" && lieu !== "TUNIS") return 3;
    if (banque === "BIAT" && lieu !== "TUNIS") return 2;
    if (banque !== "BIAT" && lieu === "TUNIS") return 1.2;
    return 0.5;
}

function calculateDaysDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}

function generateTable() {
    const dateNegociation = document.getElementById('date-negociation').value;
    const nombreEffets = parseInt(document.getElementById('nombre-effets').value);

    if (!dateNegociation || !nombreEffets || nombreEffets <= 0) {
        alert('Veuillez entrer des informations valides.');
        return;
    }

    const table = document.getElementById('bordereau-table');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    let sumValeur = 0, sumCommissions = 0, sumEscompte = 0, sumTVA = 0;

    for (let i = 0; i < nombreEffets; i++) {
        const valeurNominale = parseFloat(prompt(`Entrez la valeur nominale pour l'effet ${i + 1}:`));
        const banque = prompt(`Entrez le nom de la banque domiciliatrice pour l'effet ${i + 1}:`);
        const lieu = prompt(`Entrez la localisiation de la banque pour l'effet ${i + 1}:`);
        const dateEcheance = prompt(`Entrez la date d'échéance (yyyy-mm-dd) pour l'effet ${i + 1}:`);

        const joursAgios = calculateDaysDifference(dateNegociation, dateEcheance);
        const escompte = (valeurNominale * tauxEscompte * (joursAgios + 1)) / 36000;
        const commissionFixe = banqueDomiciliatrice(banque, lieu);
        const commissionIndep = (valeurNominale * tauxIndependant) / 100;
        const tva = (commissionFixe + commissionIndep) * 0.18;

        tbody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${banque}</td>
                <td>${lieu}</td>
                <td>${valeurNominale.toFixed(2)}</td>
                <td>${dateEcheance}</td>
                <td>${joursAgios}</td>
                <td>${escompte.toFixed(2)}</td>
                <td>${(commissionFixe + commissionIndep).toFixed(2)}</td>
                <td>${tva.toFixed(2)}</td>
            </tr>
        `;

        sumValeur += valeurNominale;
        sumCommissions += commissionFixe + commissionIndep;
        sumEscompte += escompte;
        sumTVA += tva;
    }

    const agios = sumCommissions + sumEscompte + sumTVA;
    const montantNet = sumValeur - agios;

    document.getElementById('summary').style.display = 'block';
    document.getElementById('summary').innerHTML = `
        Total Agios : ${agios.toFixed(2)}<br>
        Montant Net : ${montantNet.toFixed(2)}
    `;

    table.style.display = 'table';
}
