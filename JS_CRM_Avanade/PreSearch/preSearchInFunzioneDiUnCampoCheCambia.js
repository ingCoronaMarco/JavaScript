/*
|--------------------------------------------------------------------------
| AVA.TechnicalInterventionsForm JavaScript (Client-Side)
|--------------------------------------------------------------------------
/*
|--------------------------------------------------------------------------
| AVA.TechnicalInterventionsForm JavaScript (Client-Side)
// Script per la gestione della form Intervento Tecnico in Dynamics 365
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
'use strict'; // Modalità strict per evitare errori comuni di JS
var AVA = AVA || {}; // Namespace AVA, se non esiste lo crea
AVA.TechnicalInterventionsForm = { // Definizione oggetto per la form
	OnLoad: function (executionContext) { // Funzione chiamata al caricamento della form
		var formContext = executionContext.getFormContext(); // Ottiene il contesto della form
		if (!formContext || !formContext.data || !formContext.data.entity) { // Controlla che il contesto sia valido
			console.error("formContext non inizializzato correttamente"); // Log errore se non valido
			return; // Esce dalla funzione
		}
		var formType = formContext.ui.getFormType(); // Ottiene il tipo di form (creazione/modifica)
		var technicalinterventionId = null; // Inizializza variabile per l'ID
		if (formType === 1) { // Se la form è in modalità creazione
			console.log("🆕 Form in modalità CREAZIONE: nessun ID disponibile."); // Log informativo
		}
		else { // Se la form è in modifica
			technicalinterventionId = formContext.data.entity.getId(); // Ottiene l'ID dell'entità
			if (!technicalinterventionId) { // Se non trova l'ID
				console.warn("⚠️ Technical Intervention ID non trovato. Nessun filtro applicato."); // Log warning
				return; // Esce dalla funzione
			}
			technicalinterventionId = technicalinterventionId.replace("{", "").replace("}", ""); // Rimuove le parentesi graffe dall'ID
			console.log("🆔 Technical Intervention ID:", technicalinterventionId); // Log dell'ID
		}
		var categoriaAttr = formContext.getAttribute("ava_categoriaintervento"); // Ottiene l'attributo categoria intervento
		var assignedTechControl = formContext.getControl("ava_assignedtechnician"); // Ottiene il controllo del tecnico assegnato
		if (!categoriaAttr || !assignedTechControl) { // Se uno dei due non esiste
			console.error("Campi richiesti non trovati sul form."); // Log errore
			return; // Esce dalla funzione
		}

		var categoriaValue = categoriaAttr.getValue(); // Ottiene il valore della categoria
		if (categoriaValue) { // Se la categoria ha un valore
			assignedTechControl.addPreSearch(function () { // Aggiunge una funzione PreSearch al controllo
				AVA.TechnicalInterventionsForm.addAvailableTechniciansView(assignedTechControl, categoriaValue); // Applica la vista personalizzata
			});
		}
		categoriaAttr.addOnChange(function () { // Aggiunge evento OnChange alla categoria
			var newValue = categoriaAttr.getValue(); // Ottiene il nuovo valore
			if (newValue) { // Se il nuovo valore esiste
				assignedTechControl.addPreSearch(function () { // Aggiunge nuovamente la funzione PreSearch
					AVA.TechnicalInterventionsForm.addAvailableTechniciansView(assignedTechControl, newValue); // Applica la vista aggiornata
				});
			}
			console.log("🔁 PreSearch aggiornato su cambio categoria intervento:", newValue); // Log aggiornamento
		});
		console.log("✨ Filtro personalizzato applicato a 'ava_assignedtechnician'"); // Log finale
	},
	addAvailableTechniciansView: function (control, technicalSpecChoice) { // Funzione per aggiungere la vista personalizzata
		var viewId = "{00000000-0000-0000-0000-000000000001}"; // ID statico della vista
		var entityName = "ava_technician"; // Nome entità
		var viewDisplayName = "Tecnici Disponibili"; // Nome visualizzato della vista

		// ✅ Condizione dinamica valida solo se il valore è numerico e diverso da 915240004
		var techSpecCondition = (
			typeof technicalSpecChoice === "number" &&
			technicalSpecChoice !== null &&
			technicalSpecChoice !== undefined &&
			technicalSpecChoice !== 915240004
		) ? `<condition attribute="ava_specialization" operator="eq" value="${technicalSpecChoice}" />` : ''; // Condizione per la specializzazione

		console.log("🔍 Aggiungo la vista personalizzata per i tecnici disponibili con specializzazione:", technicalSpecChoice); // Log
		console.log("🔍 Condizione di specializzazione:", techSpecCondition); // Log

		var fetchXml = [
			'<fetch>',
			'  <entity name="ava_technician">',
			'    <attribute name="ava_name" />',
			'    <attribute name="ava_hourlyrate" />',
			'    <attribute name="ava_specialization" />',
			'    <filter>',
			'      <condition attribute="ava_available" operator="eq" value="915240001" />',
			techSpecCondition,
			'    </filter>',
			'    <link-entity name="contact" from="contactid" to="ava_technicianassociated" alias="contatto">',
			'      <attribute name="fullname" />',
			'    </link-entity>',
			'  </entity>',
			'</fetch>'
		].join(''); // Costruisce il FetchXML per la vista

		console.log("🔍 Fetch XML:", fetchXml.replace(/>\s+</g, '><')); // Log del FetchXML

		var layoutXml = [
			'<grid name="resultset" jump="ava_name" select="1" icon="1" preview="1">',
			'  <row name="result" id="ava_technicianid">',
			'    <cell name="ava_name" width="100" />',
			'    <cell name="contatto.fullname" width="117" />',
			'    <cell name="ava_hourlyrate" width="100" />',
			'    <cell name="ava_specialization" width="100" />',
			'  </row>',
			'</grid>'
		].join(''); // Costruisce il layout XML della griglia

		control.setEntityTypes(["ava_technician"]); // Imposta il tipo di entità per la lookup
		control.addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, true); // Aggiunge la vista personalizzata
		console.log("✅ Custom View aggiunta correttamente"); // Log successo
	}


	,
	myCustomViewAvailableTech: function (control) { // Funzione per aggiungere un filtro custom (non usata nel flusso principale)
		console.log("✅ Aggiungo il filtro per mostrare solo i tecnici disponibili."); // Log
		var filter = [
			'<fetch top="50">',
			'  <entity name="ava_technician">',
			'    <attribute name="ava_available" />',
			'    <filter>',
			'      <condition attribute="ava_available" operator="eq" value="915240000" />',
			'    </filter>',
			'  </entity>',
			'</fetch>'
		].join(''); // Costruisce il FetchXML per il filtro
		control.addCustomFilter(filter, "ava_technician"); // Applica il filtro custom alla lookup
		console.log("✅ Custom filter aggiunto correttamente"); // Log successo
	}
};
