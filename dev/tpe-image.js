TPE.Image = {};

TPE.Image.Methods = {
	makeLegend: function(image, legend){
		
		var options = Object.extend({
				radius: '5px',
				backgroundLegend: 'black',
				color: 'white',
				opacity: 0.8,
				widthTitle: '30%',
				heightTitle: 25,
				heightLegend: 100,
				transition: 1,
				hover: false
			}, arguments[2] || {}
		);
		
		image = $(image);
		legend = $(legend);
		var imageDim = image.getDimensions();
		
		legend.setStyle({
			paddingLeft: '10px',
			backgroundColor: options.backgroundLegend,
			height: options.heightLegend + 'px',
			color: options.color
		}).setOpacity(options.opacity);
		
		var appearLegend = function(){
			var parent = this.getOffsetParent();
			var parentLayout = parent.getLayout();
			
			if (Prototype.Browser.WebKit){
				parent.setStyle({
					WebkitTransition: options.transition + 's'
				});
				if(parentLayout.get('bottom') < 0) {
					parent.setStyle({
						bottom: '0px'
					});
				}	else {
					parent.setStyle({
						bottom: - this.next().getHeight() + 'px'
					});
				}
			}
			else {
				if (typeof Scriptaculous  === 'object' && typeof Effect === 'object'){
					if(parentLayout.get('bottom') < 0) {
						parent.morph('bottom: 0', {duration: options.transition});
					}	else {
						var bottom = - this.next().getHeight();
						parent.morph('bottom: '+ bottom + 'px', {duration: options.transition});
					}
				}else {
					if(parentLayout.get('bottom') < 0) {
						parent.setStyle({
							bottom: '0px'
						});
					}	else {
						parent.setStyle({
							bottom: - this.next().getHeight() + 'px'
						});
					}
				}
			}
		};
		
		var onglet = new Element('div', {'id': 'onglet-' + image.id + '-legend'}).setStyle({
			backgroundColor: options.backgroundLegend,
			top: 0,
			width: options.widthTitle,
			height: options.heightTitle + 'px',
			paddingLeft: '20px',
			paddingRight: '20px',
			overflow: 'visible',
			color: options.color,
			cursor: 'pointer',
			'borderRadius': '0px ' + options.radius + ' 0px 0px'
		}).setOpacity(options.opacity).click(function(){
			appearLegend.bind(this)();
		});
		
		if(options.hover){
			onglet.mousemove(function(){
				appearLegend.bind(this)();
			});
		}
		
		var legende = new Element('div', {'id': 'legende'}).update(legend).setStyle({
			position: 'absolute',
			width: '100%',
			height: (options.heightTitle + options.heightLegend)
		});
		
		image.wrap('div').makeClipping().setStyle({
				width: imageDim.width + 'px',
				height: imageDim.height + 'px',
				position: 'relative'
			}).insert(legende);
		image.relativize();
		
		onglet.insert({
			top: '<h3 id="title-' + image.id + '-legend" style="margin: 0;">' + image.readAttribute('alt') + '</h3>'
		});
		
		legende.insert({
			top: onglet
		}).setStyle({
			bottom: -legend.getHeight()+'px'
		})
	}
};

//###########################################################################################//

(function(){	
	
	if (TPE.Utils.paramScript === "true") {
		Element.addMethods('img', TPE.Image.Methods);
	}
})();

