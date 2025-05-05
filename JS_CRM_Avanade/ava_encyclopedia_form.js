// JavaScript source code
if (typeof (AVA) == "undefined") {
    AVA = { __namespace: true };
}
if (typeof (AVA.EncyclopediaForm) == "undefined") {
    AVA.EncyclopediaForm = {};
}

AVA.EncyclopediaForm.Form = new function () {
    var formContext = null;
    var globalContext = null;
    var _self = this;

    var setContext = function (executionContext) {
        if (executionContext !== null) {
            formContext = executionContext.getFormContext();
        }
        globalContext = Xrm.Utility.getGlobalContext();
    };

    _self.onLoad = function (executionContext) {
        debugger;
        setContext(executionContext);

        if (formContext.ui.getFormType() === 1) {
            // Nasconde il campo "ava_code" in fase di creazione
            formContext.getAttribute("ava_code").controls.forEach(function (oControl) {
                oControl.setVisible(false);
            });

            formContext.getAttribute("ava_defaultauth").controls.forEach(function (oControl) {
                oControl.setVisible(false);
            });

            formContext.getAttribute("ava_dateto").addOnChange(errorAlertDateField);
            formContext.getAttribute("ava_datefrom").addOnChange(errorAlertDateField);
            formContext.getAttribute("ava_type").addOnChange(hideDateWCondition);
        }

        
    };

    _self.addPreSearch = function (executionContext) {

        if (formContext.ui.getFormType() === 2) {

            // Pre-search per il lookup "ava_accountid"
            var encyclopediaId = formContext.data.entity.getId();
            if (!encyclopediaId) {
                console.warn("Enciclopedia ID non trovato. Nessun filtro applicato.");
                return;
            }

            // Rimuove eventuali graffe { } dal GUID
            encyclopediaId = encyclopediaId.replace("{", "").replace("}", "");

            var attribute = formContext.getAttribute("ava_defaultauth");
            if (!attribute) {
                console.error("Lookup 'ava_defaultauth' non trovato sul form.");
                return;
            }

            console.log("✨ Aggiunto filtro al lookup Author");
            attribute.controls.forEach(function (control) {
                control.addPreSearch(function () {
                    myCustomViewCallBack(control, encyclopediaId);
                });
            });
        };


    };

    // Funzione di validazione delle date
    var errorAlertDateField = function () {
        var dateTo = formContext.getAttribute("ava_dateto").getValue();
        var dateFrom = formContext.getAttribute("ava_datefrom").getValue();
        var alertDate = "La data di inizio o la data di fine non è valida.";

        if (dateTo && dateFrom) {
            if (dateTo < dateFrom) {
                formContext.ui.setFormNotification(alertDate, "ERROR", "Form_Warning");

                var alertOptions = {
                    text: alertDate,
                    confirmButtonLabel: "Chiudi"
                };
                Xrm.Navigation.openAlertDialog(alertOptions);

                formContext.getAttribute("ava_dateto").setValue(null);
                formContext.getAttribute("ava_datefrom").setValue(null);
            } else {
                formContext.ui.clearFormNotification("Form_Warning");
            }
        }
    };

    // Funzione per nascondere i campi data in base al tipo selezionato
    var hideDateWCondition = function () {
        var selectedTypes = formContext.getAttribute("ava_type").getValue();
        var typeOption = 915240001; // Valore "Commercial"

        console.log("Valore selezionato in ava_type:", selectedTypes);

        if (selectedTypes && selectedTypes.includes(typeOption)) {
            formContext.getControl("ava_datefrom").setVisible(false);
            formContext.getControl("ava_dateto").setVisible(false);
            console.log("❌ Campi nascosti perché il tipo è Commercial");
        } else {
            formContext.getControl("ava_datefrom").setVisible(true);
            formContext.getControl("ava_dateto").setVisible(true);
            console.log("✅ Campi visibili perché il tipo NON è Commercial");
        }
    };

    // Funzione per filtrare il lookup "ava_accountid" basato sull'Enciclopedia selezionata
    var myCustomViewCallBack = function (control, encyclopediaId) {
        var viewId = "{00000000-0000-0000-0000-000000000001}";//Questa va impostata manualmente
        var entityName = "account";
        var primaryField = "name";
        var viewDisplayName = "Authors for this Encyclopedia";

        var fetchXml = `
            <fetch distinct="true">
                <entity name="account">
                    <attribute name="name" />
                    <link-entity name="ava_book" from="ava_accountid" to="accountid">
                        <filter>
                            <condition attribute="ava_encyclopediaid" operator="eq" value="${encyclopediaId}"/>
                        </filter>
                    </link-entity>
                </entity>
            </fetch>`;

        console.log("Query generata:", fetchXml);

        var layoutXml = `
            <grid name="resultset" object="1" jump="accountid" select="1" icon="1" preview="1">
                <row name="entity" id="accountid">
                    <cell name="${primaryField}" width="300" />
                </row>
            </grid>`;

        console.log("Layout generata:", layoutXml);

        control.addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, true);
        console.log("Custom view aggiunta correttamente");
    };
};
