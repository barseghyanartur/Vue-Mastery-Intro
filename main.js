var eventBus = new Vue();

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },

  template: `
      <div class="product">
        <figure class="product-image">
          <img v-bind:src="image">
        </figure>
        <div class="product-info">
          <h1>{{ title }}</h1>
          <p v-if="inStock">In Stock</p>
          <p v-else>Out of Stock</p>
          <p>Shipping: {{ shipping }}</p>
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
          <div class="color-box"
               v-for="(variant, index) in variants"
               :key="variant.id"
               :style="{ backgroundColor: variant.color }"
               @mouseover="updateProduct(index)">
          </div>
          <button @click="addToCart"
                  :disabled="!inStock"
                  :class="{ disabledButton: !inStock }">
            Add to Cart
          </button>
          <div>
            <h2>Reviews</h2>
            <product-tabs :reviews="reviews"></product-tabs>
          </div>
        </div>
      </div>
  `,

  data() {
    return {
      product: "Socks",
      brand: "Vue Mastery",
      selectedVariant: 0,
      details: ["80% Cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          id: 2234,
          color: "green",
          image: "./green-socks.jpg",
          quantity: 10
        },
        {
          id: 2235,
          color: "blue",
          image: "./blue-socks.jpg",
          quantity: 0
        }
      ],
      reviews: []
    };
  },

  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].id);
    },
    updateProduct(index) {
      this.selectedVariant = index;
    }
  },

  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].image;
    },
    inStock() {
      return this.variants[this.selectedVariant].quantity;
    },
    shipping() {
      if (this.premium) {
        return "Free!";
      }
      return 2.99;
    }
  },

  mounted() {
    eventBus.$on("review-submitted", productReview => {
      this.reviews.push(productReview);
    });
  }
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
  <div>
    <span class="tab" 
          v-for="(tab, index) in tabs" 
          :key="index"
          @click="selected = tab"
          :class="{activeTab: selected === tab}">
      {{ tab }} 
    </span>
    <div v-show="selected === 'Reviews'">
      <p v-if="!reviews.length">There are no reviews yet.</p>
      <ul v-else>
        <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>{{ review.rating }}</p>
          <p>{{ review.review }}</p>
        </li>
      </ul>
    </div>
    <product-review 
      v-show="selected === 'Leave a Review'"></product-review>
  </div>
  `,
  data() {
    return {
      tabs: ["Reviews", "Leave a Review"],
      selected: "Reviews"
    };
  },
  methods: {}
});

Vue.component("product-review", {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
      <b>Please Correct the following errors:</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>
    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name">
    </p>
    <p>
      <label for="review">Review:</label>
      <textarea id="review" v-model="review"></textarea>
    </p>
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>
    <p>
      <input type="submit" value="Submit">
    </p>
  </form>
  `,

  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: []
    };
  },

  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating
        };

        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
      } else {
        this.errors.length = 0;
        if (!this.name) this.errors.push("Name Required");
        if (!this.rating) this.errors.push("Rating Required");
        if (!this.review) this.errors.push("Review Required");
      }
    }
  }
});

var app = new Vue({
  el: "#app",

  data: {
    premium: true,
    cart: []
  },

  methods: {
    updateCart(id) {
      this.cart.push(id);
    }
  }
});
