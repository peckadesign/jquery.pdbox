# jquery.pdbox

## Instalace

Do závislostí projektu je možné plugin přidat přes odkaz na Github následovně (více viz: http://bower.io/docs/creating-packages/#dependencies):

```
$ cat bower.json
{
	"name": "Projekt",
	"private": true,
	"dependencies": {
		"jquery.pdbox": "peckadesign/jquery.pdbox#1.0.*"
	}
}
```

## Changelog

### v1.1.0
<!--
- přechod z callbacků na eventy?
-->
- v případě použití peckadesign/pd.ajax je nutné použít verzi `~1.1`
- přejmování data atributů pro nastavení TB, místo `thickbox` se nově používá prefix `pdbox`
- lepší práce s eventy umožňující nastavit callbacky globálně pro danou instanci pdboxu 
- změny v (nejen) názvech callbacků:
  - `onBeforeOpen` místo ~~`onOpen`~~ vyvolaný před otevřením pdBoxu
  - `onAfterOpen` nový callback vyvolaný po otevření pdBoxu a nastavení class a šířky podle elementu
  - `load` zůstává, je vyvolaný při načtení obsahu pdBoxu
  - `onBeforeClose` místo ~~`onClose`~~ vyvolaný před zavřením pdBoxu
  - `onAfterClose` zůstává  vyvolaný po zavření pdBoxu
- přechod na BEM pojemnovávání CSS class a s tím související změny v HTML struktuře
- stránkování obsahuje informaci o stránce z kolika, na které právě jsme

### v1.0.3
- oprava skrývání/zobrazování `.pd-box-desc` v obrázkovém thickboxu

### v1.0.2
- změněn způsob, jakým se nastavují parametry TB (šířka, class, callbacky) při otevření TB a při procházení v něm
- mělo by definitivně řešit problémy s procházením odkazů uvnitř tb, kdy se měnila šířka, atp.
- související změny v pd.ajax.js jsou na pneumatikách (automatické nastavení class thickbox odkazům uvnitř TB, které mají class ajax, ...)
