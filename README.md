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

### v1.0.3
- oprava skrývání/zobrazování `.pd-box-desc` v obrázkovém thickboxu

### v1.0.2
- změněn způsob, jakým se nastavují parametry TB (šířka, class, callbacky) při otevření TB a při procházení v něm
- mělo by definitivně řešit problémy s procházením odkazů uvnitř tb, kdy se měnila šířka, atp.
- související změny v pd.ajax.js jsou na pneumatikách (automatické nastavení class thickbox odkazům uvnitř TB, které mají class ajax, ...)
