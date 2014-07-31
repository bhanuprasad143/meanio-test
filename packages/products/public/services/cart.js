'use strict';

angular.module('mean.products').factory('shoppingCart', ['$resource',
  function($resource) {
  	var cart = {
  		items: {},
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
	  		$this.loadItems();
	  		if($this.items[product._id]){
	  			$this.items[product._id].quantity += 1;
	  		}else{
	  			$this.items[product._id] = {
	  				productId: product._id,
	  				image: product.image,
	  				name: product.name,
	  				price_in_cents: product.price_in_cents,
	  				quantity: 1
	  			};
	  		}
	  		console.log($this.items);
	  		$this.storeCart();
	  	},
	  	removeItem: function(product){
	  		console.log('removeItem');
	  		var $this = this;
	  		$this.loadItems();
	  		if($this.items[product._id]){
	  			delete($this.items[product._id]);
	  		}
	  		$this.storeCart();
	  	},
	  	updateItem: function(product, quantity){
	  		console.log('updateItem');
	  		var $this = this;
	  		$this.loadItems();
	  		if($this.items[product._id]){
	  			$this.items[product._id] = quantity;
	  		}
	  		$this.storeCart();
	  	},
	  	loadItems: function(){
	  		console.log('loadItems');
	  		var $this = this;
	  		var items = null;
	  		try{
		  		if(localStorage !== null) {
		  			items = localStorage.cartItems;
		  		}
		  		if (items !== null && JSON !== null){
		  			$this.items = JSON.parse(items);
		  		}else{
		  			$this.items = {};
		  		}
		  	}catch(e){
		  		$this.items = {};
		  	}
	  	},
	  	storeCart: function(){
	  		console.log('storeCart');
	  		var $this = this;
	  		localStorage.cartItems = JSON.stringify($this.items);
	  	}

  	};
  	return cart;
  }
]);
