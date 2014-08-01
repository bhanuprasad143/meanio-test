'use strict';

angular.module('mean.products').service('shoppingCart', ['$resource', 'Items',
  function($resource, Items) {
  	var cart = {
  		loaded: false,
  		items: [],
  		count: function(){
  			var $this = this;
  			var count = 0;
  			for(var i in $this.items){
  				var item = $this.items[i];
  				if(item && item.quantity){
  					count += item.quantity;
  				}
  			}
  			return count;
  		},
  		total: function(){
  			var total = 0;
  			var $this = this;
  			$this.loadItems();
  			angular.forEach($this.items, function(item, key){
  				if(item && item.quantity){
	  				total += (item.product.price_in_cents * item.quantity)/100;
  				}
  			});
  			return total;
  		},
	  	addItem: function(product){
	  		var $this = this;
  			var item = $this.findItem(product._id);

  			if(item){
	  			console.log('addItem');
		  		console.log(item.quantity);
  				item.quantity += 1;
  				console.log(item.quantity);

  				item.$update();
  			}else{
  				console.log('adddddItem......');
	  			item = new Items({
	  				product: product._id,
	  				quantity: 1
	  			});
	  			item.$save(function(resp){
	  				$this.items.push(resp);
	  			});
  			}

	  	},
	  	removeItem: function(item){
	  		console.log('removeItem');
	  		var $this = this;
	  		for(var i in $this.items){
	  			var hold = $this.items[i];
	  			if(hold._id === item.product._id || (hold.product && hold.product._id===item.product._id || hold.product === item.product._id)){
	  				var rmItem = $this.items.splice(i,1);
	  				console.log(rmItem);
	  				item.$remove();
	  				break;
	  			}
	  		}
	  	},
	  	updateItem: function(item, quantity){
	  		console.log('updateItem');
	  		// var $this = this;
	  		item.quantity = quantity;
	  		item.$save();
	  	},
	  	loadItems: function(){
	  		var $this = this;
	  		if(!$this.loaded){
	  			$this.loaded = true;
		  		$this.items = [];
	  			Items.query(function(items){
	  				angular.forEach(items, function(item){
	  					$this.items.push(item);
	  				});
	  			});
			  }
	  	},

	  	updateCart: function(){
	  		var $this = this;
	  		angular.forEach($this.items,function(item){
	  			item.$update();
	  		});
	  	},

	  	findItem: function(productId){
	  		var $this = this;
	  		var rtn = null;
	  		for(var i in $this.items){
	  			var item = $this.items[i];
	  			if(item._id === productId || (item.product && item.product._id===productId || item.product === productId)){
	  				rtn = item;
	  				break;
	  			}
	  		}
	  		return rtn;
	  	}

  	};
  	return cart;
  }
]);
