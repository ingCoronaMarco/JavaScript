function onRetireBookOdata(primaryControl) {
    // Controllo Primary Control
    if (!primaryControl) {
        console.log("Errore: PrimaryControl non passato");
        Xrm.Navigation.openAlertDialog({ text: "Errore: impossibile passare PrimaryControl" });
        return;
    }

    // Recupero il contesto del form
    var formContext = primaryControl;
    var encyclopediaId = formContext.data.entity.getId().replace("{", "").replace("}", ""); // Pulizia del GUID

    // Controllo se è stato passato correttamente l'ID
    if (!encyclopediaId) {
        Xrm.Navigation.openAlertDialog({ text: "Errore: ID Encyclopedia non valido" });
        return; // Blocca l'esecuzione se manca l'ID
    }

    // 🔹 Verifica se l'enciclopedia è associata a una libreria attiva
    checkEncyclopediaAssociation(encyclopediaId, function (isAssociated) {
        if (isAssociated) {
            Xrm.Navigation.openAlertDialog({ text: "❌ Non si può ritirare: l'enciclopedia appartiene a una libreria attiva." });
        } else {
            Xrm.Navigation.openAlertDialog({ text: "✅ L'enciclopedia non è associata a nessuna libreria attiva." });
        }
    });
}

// 🔹 Controlla se l'enciclopedia è associata a una library attiva
function checkEncyclopediaAssociation(encyclopediaId, callback) {
    //Errore : dimenticarsi di passare correttamente la GUID dell oggetto preso in considerazione durante la costruzione del link
    let oDataQuery = "ava_librarys?$select=ava_libraryid,ava_code,createdon&$orderby=ava_code asc&$filter=ava_libraryid eq '" + encyclopediaId + "'";

    Xrm.WebApi.retrieveMultipleRecords("ava_library", oDataQuery)
        .then(function (result) {
            callback(result.entities.length > 0); // Controlla se esistono librerie attive associate
        })
        .catch(function (error) {
            Xrm.Navigation.openAlertDialog({ text: "❌ Errore nel recupero dei dati: " + error.message });
            callback(true); // In caso di errore, blocchiamo il processo per sicurezza
        });
}
