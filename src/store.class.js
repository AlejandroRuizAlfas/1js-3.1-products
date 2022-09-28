const Category = require("./category.class");
const Product = require("./product.class");

class Store {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.products = [];
        this.categories = [];
    }

    getCategoryById(id) {
        let category = this.categories.find((cat) => cat.id === id);
        if (!category) {
            throw "No existe una categoria con esa id";
        }
        return category;
    }

    getCategoryByName(name) {
        let category = this.categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase());
        if (!category) {
            throw "No existe una categoria con ese nombre";
        }
        return category;
    }

    getProductById(id) {
        let product = this.products.find((prod) => prod.id === id);
        if (!product) {
            throw "No existe un producto con esa id";
        }
        return product;
    }

    getProductsByCategory(id) {
        return this.products.filter((pro) => pro.category === id);
    }

    addCategory(nombre, descripcion) {
        if (!nombre) {
            throw "No existe una categoria con ese nombre";
        }
        try {
            this.getCategoryByName(nombre);
        } catch (err) {
            let newCategory = new Category(this.getNewId(this.categories), nombre, descripcion);
            this.categories.push(newCategory);
            return newCategory;
        }

        throw "No existe una categoria con ese nombre";
    }
    addProduct(prod) {
        if (!prod.name) {
            throw "No puedes crear un producto sin nombre";
        }
        if (!prod.category) {
            throw "No puedes crear un producto sin categoria";
        }
        if (!prod.price || prod.price < 0) {
            throw "No puedes crear un producto sin precio o negativo";
        }
        if (isNaN(prod.price)) {
            throw "No puedes crear un producto con precio no numerico";
        }
        if (prod.units < 0) {
            throw "No puedes crear un producto con unidades negativas";
        }
        if (prod.units && isNaN(prod.units)) {
            throw "No puedes crear un producto con unidades no numericas";
        }
        if (prod.units && !Number.isInteger(prod.units)) {
            throw "No puedes crear un producto si las unidades no son enteras";
        }
        try {
            this.getCategoryById(prod.category);
        } catch (err) {
            throw "No puedes crear un producto cuya categoria no existe";
        }

        let newProduct = new Product(this.getNewId(this.products), prod.name, prod.category, prod.price, prod.units);
        this.products.push(newProduct);
        return newProduct;
    }

    delCategory(id) {
        let categoria;
        try {
            categoria = this.getCategoryById(id);
        } catch (err) {
            throw "No existe la categoria";
        }
        if (this.products.find((prod) => prod.category === id)) {
            throw "No se puede borrar una categoria con productos";
        }

        let index = this.categories.findIndex((cat) => cat.id === id);
        let borrada = this.categories.splice(index, 1);
        return borrada[0];
    }

    delProduct(id) {
        let producto;
        try {
            producto = this.getProductById(id);
        } catch (err) {
            throw "No existe el producto";
        }
        if (producto.units > 0) {
            throw "No se puede borrar un producto con unidades mayor que 0";
        }

        let index = this.products.findIndex((pro) => pro.id === id);
        let borrado = this.products.splice(index, 1);
        return borrado[0];
    }

    totalImport() {
        return this.products.reduce((total, prod) => (total += prod.productImport()));
    }

    orderByUnitsDesc() {
        this.products.sort((prod1, prod2) => prod1.units - prod2.units).reverse();
        return this.products;
    }

    orderByName() {
        this.products.sort((prod1, prod2) => prod1.name.localeCompare(prod2.name));
        return this.products;
    }

    underStock(units) {
        return this.products.filter((prod) => prod.units < units);
    }

    getNewId(array) {
        let newID = array.reduce((max, obj) => (obj.id > max ? obj.id : max), 0);
        return newID + 1;
    }
}

// Aquí la clase Store

module.exports = Store;
