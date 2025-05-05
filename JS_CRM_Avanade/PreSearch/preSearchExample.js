if (typeof (ava) === "undefined") { ava = { __namespace: true }; }
if (typeof (ava.encyclopedia) === "undefined") { ava.encyclopedia = { __namespace: true }; }

ava.encyclopedia.Form = new function () {

    var formContext = null;
    var _self = this;

    // Funzione di supporto per settare il contesto
    var setContext = function (executionContext) {
        if (executionContext !== null) {
            formContext = executionContext.getFormContext();
        }
    };

    // Funzione OnLoad del form
    _self.OnLoad = function (executionContext) {
        setContext(executionContext);

        // Ricava l'ID della Enciclopedia corrente
        var encyclopediaId = formContext.data.entity.getId();
        if (!encyclopediaId) {
            console.warn("Enciclopedia ID non trovato. Nessun filtro applicato.");
            return;
        }

        // Rimuove eventuali graffe { } dal GUID
        encyclopediaId = encyclopediaId.replace("{", "").replace("}", "");

        // Recupera l'attributo (lookup) su cui vogliamo fare presearch
        var attribute = formContext.getAttribute("ava_accountid");
        if (!attribute) {
            console.error("Lookup 'ava_accountid' non trovato sul form.");
            return;
        }

        console.log("✨ Aggiunto filtro al lookup Author");
        
        // Aggiunge il PreSearch su tutti i controlli associati a 'ava_accountid'
        attribute.controls.forEach(function(control) {
            control.addPreSearch(function() {
                myCustomViewCallBack(control, encyclopediaId);
            });
        });
    };

    // Funzione che costruisce e applica il filtro FetchXML
    function myCustomViewCallBack(control, encyclopediaId) {

        var viewId = "{00000000-0000-0000-0000-000000000001}";
        var entityName = "account";
        var primaryField = "name";
        var viewDisplayName = "Authors for this Encyclopedia";
         
       //"${encyclopediaId}"
       //"${primaryField}"

        let fetchXml = `
        <fetch  distinct="true">
  <entity name="account">
    <attribute name="name" />
    <link-entity name="ava_book" from="ava_accountid" to="accountid">
      <filter>
        <condition attribute="ava_encyclopediaid" operator="eq" value="${encyclopediaId}" />
      </filter>
    </link-entity>
  </entity>
</fetch>
   `;

        console.log("Query generata:", fetchXml);

        let layoutXml = `<grid name="resultset" object="1" jump="accountid" select="1" icon="1" preview="1">
  <row name="entity" id="accountid">
    <cell name="${primaryField}" width="300" />
  </row>
</grid>`;

        console.log("Layout generata:", layoutXml);

        // Aggiunge la custom view al lookup
        control.addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, true);
        console.log("Custom view aggiunta correttamente");
    }

};
