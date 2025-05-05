// Definizione dei namespace
// Definizione dei namespace
if (typeof (ava) == "undefined")
{
	ava = {};
}
if (typeof (ava.encyclopedia) == "undefined")
{
	ava.encyclopedia = {};
}
// Form con logica di validazione
ava.encyclopedia.Form = new function ()
{
	var formContext = null;
	var globalContext = null;
	var _self = this;
	let isErrorDisplayed = false; // ✅ Variabile globale per evitare errori multipli
	var setContext = function (executionContext)
	{
		if (executionContext !== null)
		{
			formContext = executionContext.getFormContext(); // Contesto del form
		}
		globalContext = Xrm.Utility.getGlobalContext();
	};
	// Validazione su `ava_datefrom`

	function ValidateDateFrom(executionContext)
	{
		setContext(executionContext);
		let dateFrom = formContext.getAttribute("ava_datefrom").getValue();
		let dateTo = formContext.getAttribute("ava_dateto").getValue();
		if (dateFrom && dateTo && dateFrom > dateTo)
		{
			if (!isErrorDisplayed)
			{
				isErrorDisplayed = true; // ✅ Evita la ripetizione del messaggio
				Xrm.Navigation.openAlertDialog(
				{
					text: "Errore: La data di inizio deve essere minore o uguale alla data di fine."
				})
					.then(function ()
				{
					isErrorDisplayed = false; // ✅ Ripristina la possibilità di mostrare errori successivi
					formContext.getAttribute("ava_datefrom").setValue(null); // ❌ Resetta il campo errato
				});
			}
		}
	}
	// Validazione su `ava_dateto`

	function ValidateDateTo(executionContext)
	{
		setContext(executionContext);
		let dateFrom = formContext.getAttribute("ava_datefrom").getValue();
		let dateTo = formContext.getAttribute("ava_dateto").getValue();
		if (dateFrom && dateTo && dateTo < dateFrom)
		{
			if (!isErrorDisplayed)
			{
				isErrorDisplayed = true; // ✅ Evita la ripetizione del messaggio
				Xrm.Navigation.openAlertDialog(
				{
					text: "Errore: La data di fine deve essere maggiore o uguale alla data di inizio."
				})
					.then(function ()
				{
					isErrorDisplayed = false; // ✅ Ripristina la possibilità di mostrare errori successivi
					formContext.getAttribute("ava_dateto").setValue(null); // ❌ Resetta il campo errato
				});
			}
		}
	}
	_self.OnLoad = function (executionContext)
	{
		setContext(executionContext);
		let dateFromAttr = formContext.getAttribute("ava_datefrom");
		let dateToAttr = formContext.getAttribute("ava_dateto");
		if (dateFromAttr) dateFromAttr.addOnChange(ValidateDateFrom);
		if (dateToAttr) dateToAttr.addOnChange(ValidateDateTo);
	};
};
