'use strict';

angular.module('mean.products').service('shoppingCart', ['$resource', 'Items',
  function($resource, Items) {
  	var cart = {
  		loaded: false,
  		items: Items.query(),
  		count: function(){
  			var $this = this;
  			$this.loadItems();
  			var count = 0;
  			angular.forEach($this.items, function(item, key){
  				if(item && item.quantity){
	  				count += item.quantity;
  				}
  			});
  			return count;
  		},
  		total: function(){
  			var total = 0;
  			var $this = this;
  			$this.loadItems();
  			angular.forEach($this.items, function(item, key){
  				if(item && item.quantity){
	  				total += (item.price_in_cents * item.quantity)/100;
  				}
  			});
  			return total;
  		},
	  	addItem: function(product){
	  		var $this = this;
  			console.log('addItem');
	  		// $this.loadItems();
	  		// console.log(product);
	  		// // if($this.items[product._id]){
	  		// // 	$this.items[product._id].quantity += 1;
	  		// // }else{
	  		// // 	$this.items[product._id] = {
	  		// // 		id: product._id,
	  		// // 		productId: product._id,
	  		// // 		image: product.image,
	  		// // 		name: product.name,
	  		// // 		price_in_cents: product.price_in_cents,
	  		// // 		quantity: 1
	  		// // 	};
	  		// // }
	  		Items.get({itemId: product._id}, function(resp){
	  			if(resp){
		  			console.log(resp);
		  			resp.quantity += 1;
		  			resp.$update();
	  			}else{
		  			var item = new Items({
		  				product: product._id,
		  				quantity: 1
		  			});
		  			item.$save(function(response) {
							$this.items.push(response)		        
		        });

	  			}

	  		});

	  		$this.storeCart();
	  	},
	  	removeItem: function(item){
	  		console.log('removeItem');
	  		var $this = this;
	  		$this.loadItems();
	  		if($this.items[item.id]){
	  			delete($this.items[item.id]);
	  		}
	  		$this.storeCart();
	  	},
	  	updateItem: function(item, quantity){
	  		console.log('updateItem');
	  		var $this = this;
	  		$this.loadItems();
	  		if($this.items[item.id]){
	  			$this.items[item.id] = quantity;
	  		}
	  		$this.storeCart();
	  	},
	  	loadItems: function(){
	  		var $this = this;
	  		var items = null;
	  		if(!$this.loaded){
	  			$this.loaded = true;
		  		console.log('loadItems');
			  }
	  	},
	  	storeCart: function(){
	  		var $this = this;
	  		localStorage.cartItems = JSON.stringify($this.items);
	  	}

  	};
  	return cart;
  }
]);
