function onRetireBookClick(primaryControl) {
    if (!primaryControl) {
        console.error("Errore: PrimaryControl non è stato passato correttamente.");
        Xrm.Navigation.openAlertDialog({ text: "Errore: impossibile recuperare il contesto del form." });
        return;
    }

    var formContext = primaryControl; // Contesto del form
    var encyclopediaId = formContext.data.entity.getId().replace("{", "").replace("}", ""); // Recupera l'ID senza {}

    if (!encyclopediaId) {
        Xrm.Navigation.openAlertDialog({ text: "Errore: ID Enciclopedia non valido." });
        return;
    }

    // 🔹 Controlla se l'enciclopedia è associata a una library attiva
    checkEncyclopediaAssociation(encyclopediaId, function(isAssociated) {
        if (isAssociated) {
            Xrm.Navigation.openAlertDialog({ text: "❌ L'enciclopedia è associata a una library attiva. Operazione non consentita." });
        } else {
            // 🔹 Invece di chiamare l'Action, mostriamo solo un messaggio di successo
            Xrm.Navigation.openAlertDialog({ text: "✅ L'enciclopedia non è associata a nessuna library attiva!" });
        }
    });
}

// 🔹 Verifica se l'enciclopedia è associata a una library attiva
function checkEncyclopediaAssociation(encyclopediaId, callback) {
    let fetchXml = "<fetch version='1.0' mapping='logical' distinct='true'>" +
        "<entity name='ava_library'>" +
        "<attribute name='ava_libraryid'/>" +
        "<filter type='and'>" +
        "<condition attribute='statecode' operator='eq' value='0'/>" +  // Solo library attive
        "</filter>" +
        "<link-entity name='ava_ava_encyclopedia_ava_library' from='ava_libraryid' to='ava_libraryid' intersect='true'>" +
        "<link-entity name='ava_encyclopedia' from='ava_encyclopediaid' to='ava_encyclopediaid'>" +
        "<filter type='and'>" +
        "<condition attribute='ava_encyclopediaid' operator='eq' value='" + encyclopediaId + "'/>" + // Solo per questa enciclopedia
        "</filter>" +
        "</link-entity>" +
        "</link-entity>" +
        "</entity>" +
        "</fetch>";

    Xrm.WebApi.retrieveMultipleRecords("ava_library", "?fetchXml=" + encodeURIComponent(fetchXml))
        .then(function(result) {
            callback(result.entities.length > 0);
        })
        .catch(function(error) {
            Xrm.Navigation.openAlertDialog({ text: "Errore nel controllo della library: " + error.message });
            callback(true);  // Se c'è un errore, per sicurezza blocchiamo l'operazione
        });
}

