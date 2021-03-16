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

### v1.3.14
- oprava srbského překladu

### v1.3.13
- do událostí `beforeClose` a `afterClose` nově v `data` posíláme i `event`, který vyvolal zavření

### v1.3.12
- oprava iterování přes `Array`

### v1.3.11
- přidání rumunského (`ro`) a srbského (`sr`) překladu

### v1.3.10
- oprava chybějícího ukončovacího tagu `li` u náhledů v pdboxu

### v1.3.9
- přidáno option `imageThumbnailsAlign` pro automatické zascrollování náhledů oři otevření pdboxu a jeho stránkování.
Hodnotou je buď objekt přijímaný metodou [`Element.scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
nebo funkce, která takový objekt vrací

### v1.3.8
- oprava scrollování pdboxu na iOS

### v1.3.7
- přes data atribut je nyní možné předat více než jeden callback; jednotlivé callbacky se oddělují mezerou, viz příklad

### v1.3.6
- do `onBeforeClose` a `onAfterClose` callbacků se předává objekt, obsahující element, který pdbox otevřel; stejně jako do ostatních callbacků, viz příklad 

### v1.3.5
- oprava smazaného modifikátoru `pdbox--inner` při použití option `isInner` u pdboxu

### v1.3.4
- titulek a popis v pdboxu je možno nastavit pomocí data atributů na odkazu (`data-pdbox-title` a `data-pdbox-description`)

### v1.3.3
- revert zpět k funkcionalitě z 1.3.1; 1.3.2 potenciálně rozbíjí AJAXové formuláře uvnitř pdboxu

### v1.3.2
- obrázek lze v pdboxu otevřít i bez atributu `data-rel`

### v1.3.1
- přidáno nové option `inifinitePager`, výchozí hodnota je `false`, v případě `true` se pomocí šipek lze přepínat stále dokola (tj. z posledního na první šipkou doprava, z prvního na poslední šipkou doleva)
- u obrázkového pdboxu je element pro obrázek (`.pdbox__media-box`) zobrazen i při otevření, pro obrázek je tak rezervované místo
- do defaults přidána výchozí hodnota pro option `imageThumbnails` (bez vlivu na funčknost, pouze pro přehlednost) 

### v1.3.0
- oprava [#16](https://github.com/peckadesign/jquery.pdbox/issues/16)
- kliknutí na obrázek již nezavírá pdbox
- podpora pro responsivní obrázky v pdboxu [#13](https://github.com/peckadesign/jquery.pdbox/issues/13)
  - **BC break:** přejmenování class ~~`pdbox__image`~~ a ~~`pdbox__video`~~ na jednotné `pdbox__media-box` s BEM modifikátorem pro rozližení videa (`pdbox__media-box--video`) a obrázku (`pdbox__media-box--image`)
  - použitím atributu `data-pdbox-srcset` na odkazu lze nastavit `srcset` pro obrázek v pdboxu
  - přidáno nové options `sizes` pro nastavení rozměrů pdboxu, hodnota se použije jako atribut `sizes` na obrázku
  - pomocí atributu `data-pdbox-sizes` na odkazu lze přepsat výchozí `sizes`, například je-li nějaký speciální pdbox pro obrázky jinak velký

### v1.2.0
- **BC break:** při použití metody `setOptions` s parametrem `options` je nově nutné poslat jako druhý parametr `true` pro rozlišení mezi skutečným options a contextem
- oprava autora v `package.json`
- při použití metody `openHtml` opraveno probliknutí spinneru na pozadí
- při použití metody `openUrl` je možno předat element, ze kterého se přeberou options (napr. odkaz, na který se kliklo)
- oprava [#9](https://github.com/peckadesign/jquery.pdbox/issues/9)
- do callbacku `onLoad` se předává element, který otevřel pdbox, stejně jako do ostatních callbacků

### v1.1.1
- oprava [#8](https://github.com/peckadesign/jquery.pdbox/issues/8)
- oprava data atributů pro navázání onAfterOpen callbacku na elementu v příkladu

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
- přidáno option `imageThumbnails` umožňující vypsat krom klasického stránkování i náhledové obrázky; náhledy se berou z odkazu z data atibutu `data-pdbox-thumbnail` 

### v1.0.3
- oprava skrývání/zobrazování `.pd-box-desc` v obrázkovém thickboxu

### v1.0.2
- změněn způsob, jakým se nastavují parametry TB (šířka, class, callbacky) při otevření TB a při procházení v něm
- mělo by definitivně řešit problémy s procházením odkazů uvnitř tb, kdy se měnila šířka, atp.
- související změny v pd.ajax.js jsou na pneumatikách (automatické nastavení class thickbox odkazům uvnitř TB, které mají class ajax, ...)
