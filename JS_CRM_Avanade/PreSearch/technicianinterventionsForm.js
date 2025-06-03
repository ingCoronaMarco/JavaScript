/*
|--------------------------------------------------------------------------
| AVA.TechnicalInterventionsForm JavaScript (Client-Side)
|--------------------------------------------------------------------------
| Contesto: Dynamics 365 – Form Intervento Tecnico (Technical Intervention)
|
| ✅ Scopo: Aggiunge una vista personalizzata alla lookup del tecnico assegnato.
|
| 🛠️ Problemi riscontrati durante lo sviluppo/debug:
| 
| 1. ❌ Funzione OnLoad non trovata:
|    → Causato da errata dichiarazione (es. `new function ()` o namespace non pubblico).
|    → Risolto usando oggetto letterale esposto: AVA.TechnicalInterventionsForm = { ... }
|
| 2. ❌ Alias nel layoutXml (es. `Nome.fullname`):
|    → Dynamics 365 NON supporta alias arbitrari nel layout della griglia.
|    → Risolto definendo alias esplicito `alias="contatto"` nel fetchXml e usando `contatto.fullname`.
|
| 3. ❌ Campo fullname non visualizzato:
|    → Il layout richiede che gli attributi nel link-entity abbiano alias riconosciuti.
|    → Risolto assicurandosi che il campo venga incluso con alias e referenziato correttamente.
|
| 4. ⚠️ In modalità creazione (`formType === 1`) l'ID non è disponibile:
|    → Implementato controllo su `formContext.ui.getFormType()` per gestire ID solo in modifica.
|
| 5. ⚠️ Sintassi XML non valida nel JS:
|    → Errori causati da tag XML con spazi errati (`< entity>`), virgole inutili, attributi malformati.
|    → Risolto validando XML manualmente e usando `.join('')` per creare Fetch e Layout XML.
|
| 🔍 Raccomandazioni future:
| - Evita alias complessi nel layoutXml.
| - Verifica sempre che i lookup abbiano valore prima di applicare filtri.
| - Testa sia in modalità "Create" che "Update".
| - Usa `F12` (console) per validare `typeof funzione` e identificare errori di caricamento script.
|
|--------------------------------------------------------------------------
*/

'use strict';

var AVA = AVA || {};

AVA.TechnicalInterventionsForm = {
	OnLoad: function (executionContext) {
		var formContext = executionContext.getFormContext();
		if (!formContext || !formContext.data || !formContext.data.entity) {
			console.error("formContext non inizializzato correttamente");
			return;
		}

		var formType = formContext.ui.getFormType();
		var technicalinterventionId = null;

		if (formType === 1) {
			console.log("🆕 Form in modalità CREAZIONE: nessun ID disponibile.");
		}
		else {
			technicalinterventionId = formContext.data.entity.getId();
			if (!technicalinterventionId) {
				console.warn("⚠️ Technical Intervention ID non trovato. Nessun filtro applicato.");
				return;
			}
			technicalinterventionId = technicalinterventionId.replace("{", "").replace("}", "");
			console.log("🆔 Technical Intervention ID:", technicalinterventionId);
		}

		var attribute = formContext.getAttribute("ava_assignedtechnician");
		if (!attribute) {
			console.error("Lookup 'ava_assignedtechnician' non trovata sul form.");
			return;
		}

		attribute.controls.forEach(function (control) {
			control.addPreSearch(function () {
				AVA.TechnicalInterventionsForm.addAvailableTechniciansView(control);
			});
		});

		console.log("✨ Filtro personalizzato applicato a 'ava_assignedtechnician'");
	},

	addAvailableTechniciansView: function (control) {
		var viewId = "{00000000-0000-0000-0000-000000000001}";
		var entityName = "ava_technician";
		var viewDisplayName = "Tecnici Disponibili";

		var fetchXml = [
			'<fetch>',
			'  <entity name="ava_technician">',
			'    <attribute name="ava_name" />',
			'    <attribute name="ava_hourlyrate" />',
			'    <filter>',
			'      <condition attribute="ava_available" operator="eq" value="915240001" />',
			'    </filter>',
			'    <link-entity name="contact" from="contactid" to="ava_technicianassociated" alias="contatto">',
			'      <attribute name="fullname" />',
			'    </link-entity>',
			'  </entity>',
			'</fetch>'
		].join('');

		var layoutXml = [
			'<grid name="resultset" jump="ava_name" select="1" icon="1" preview="1">',
			'  <row name="result" id="ava_technicianid">',
			'    <cell name="ava_name" width="100" />',
			'    <cell name="contatto.fullname" width="117" />',
			'    <cell name="ava_hourlyrate" width="100" />',
			'  </row>',
			'</grid>'
		].join('');

		control.setEntityTypes(["ava_technician"]);
		control.addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, true);
		console.log("✅ Custom View aggiunta correttamente");
	},

	myCustomViewAvailableTech: function (control) {
		console.log("✅ Aggiungo il filtro per mostrare solo i tecnici disponibili.");

		var filter = [
			'<fetch top="50">',
			'  <entity name="ava_technician">',
			'    <attribute name="ava_available" />',
			'    <filter>',
			'      <condition attribute="ava_available" operator="eq" value="915240000" />',
			'    </filter>',
			'  </entity>',
			'</fetch>'
		].join('');

		control.addCustomFilter(filter, "ava_technician");
		console.log("✅ Custom filter aggiunto correttamente");
	}
};
