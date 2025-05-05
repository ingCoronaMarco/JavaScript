if (typeof (ava) === "undefined") {
	ava = {
		__namespace: true
	};
}
if (typeof (ava.richiestarimborso) === "undefined") {
	ava.richiestarimborso = {
		__namespace: true
	};
}
ava.richiestarimborso.Form = new function () {
	var formContext = null;
	var globalContext = null;
	var _self = this;
	var setContext = function (executionContext) {
		if (executionContext !== null) {
			formContext = executionContext.getFormContext();
		}
		globalContext = Xrm.Utility.getGlobalContext();
	};
	_self.hideField = function (field) {
		if (formContext.getControl(field)) {
			formContext.getControl(field).setVisible(false);
		}
	};
	_self.showField = function (field) {
		if (formContext.getControl(field)) {
			formContext.getControl(field).setVisible(true);
		}
	};
	_self.deactivateField = function (field) {
		if (formContext.getControl(field)) {
			formContext.getControl(field).setDisabled(true);
		}
	};
	_self.activateField = function (field) {
		if (formContext.getControl(field)) {
			formContext.getControl(field).setDisabled(false);
		}
	};
	_self.conditionStatusImportoClient = function (executionContext) {
		// Supporto anche per OnChange
		if (executionContext) {
			setContext(executionContext);
		}
		let fieldTarget = "ava_statodocumento";
		let statoAttr = formContext.getAttribute(fieldTarget);
		if (!statoAttr) {
			console.warn("Attributo non trovato: " + fieldTarget);
			return;
		}
		let statoRimborso = statoAttr.getValue();
		let triggerStato = 915240000;
		let importoField = "ava_importo";
		let clienteField = "ava_richiedente";
		if (statoRimborso !== triggerStato) {
			_self.deactivateField(importoField);
			_self.deactivateField(clienteField);
			console.log("Importo e cliente disattivato")
		}
		else {
			_self.activateField(importoField);
			_self.activateField(clienteField);
			console.log("Importo e cliente attivato")
		}
	};
	_self.onLoad = function (executionContext) {
		setContext(executionContext);
		// Aggiunge la funzione all'evento OnChange
		var attributo = formContext.getAttribute("ava_statodocumento");
		if (attributo) {
			attributo.addOnChange(_self.conditionStatusImportoClient);
		}
		_self.conditionStatusImportoClient(); // esegue subito anche onLoad
	};
	_self.setContext = setContext;
};
