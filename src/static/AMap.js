export default function MapLoader() {
	return new Promise((resolve, reject) => {
		if (window.AMap) {
			resolve(window.AMap)
		} else {
			var script = document.createElement('script')
			script.type = 'text/javascript'
			script.async = true
			script.src = 'http://webapi.amap.com/maps?v=2.0&callback=initAMap&key=565656546hjghjhj&plugin=AMap.Geocoder,AMap.AutoComplete'
			script.onerror = reject
			document.head.appendChild(script)
		}
		window.initAMap = () => {
			resolve(window.AMap)
		}
	})
}
