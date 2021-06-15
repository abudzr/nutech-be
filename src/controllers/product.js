const productModels = require('../models/product')
const helper = require('../helpers/helper')
// const validation = require('../helpers/validation')

exports.insertProduct = async (req, res) => {
    try {
        const { nameProduct, purchasePrice, sellingPrice, stock } = req.body
        const data = {
            nameProduct,
            purchasePrice,
            sellingPrice,
            stock,
            image: `images\\${req.file.filename}`,
        }
        productModels.insertProduct(data)
            .then(() => {
                helper(res, 200, true, "Create Product Success")
            })
            .catch((err) => {
                if (err.message === "Name has been registered") {
                    helper(res, 400, false, err.message);
                } else {
                    helper(res, 500, false, err.message);
                }
            })
    } catch (error) {
        if (error.message === "Name has been registered") {
            helper(res, 400, false, error.message);
        } else {
            helper(res, 500, false, error.message);
        }
    }
}

exports.findAll = (req, res) => {
    const { page, perPage } = req.query;
    const keyword = req.query.keyword ? req.query.keyword : "";
    const sortBy = req.query.sortBy ? req.query.sortBy : "id";
    const order = req.query.order ? req.query.order : "ASC";

    productModels
        .getAllProduct(page, perPage, keyword, sortBy, order)
        .then(([totalData, totalPage, result, page, perPage]) => {
            if (result < 1) {
                helper(res, 400, false, "Product not found");
                return;
            }
            for (let i = 0; i < perPage; i++) {
                if (result[i] === undefined) {
                    break;
                }
            }
            const data = {
                totalData,
                totalPage,
                result,
                page,
                perPage
            }
            helper(
                res,
                200,
                true,
                "Find all users successfully",
                data
            );
        })
        .catch((err) => {
            helper(res, 500, false, err.message);
        });
};



// exports.getProduct = (req, res) => {
//     productModels.getProduct()
//         .then((result) => {
//             if (result.length > 0) {
//                 helper(res, 200, true, `Product ${result.length} Found`, result)
//             } else {
//                 helper(res, 400, false, 'Product Not Found')
//             }
//         })
// }

exports.delete = (req, res) => {
    const id = req.params.id;
    productModels
        .getProductId(id)
        .then((result) => {
            if (result.length > 0) {
                productModels.deleteProduct(id)
                    .then((result) => {
                        helper(res, 200, true, "Product has been deleted");
                    })
            } else {
                helper(res, 400, false, 'Product Not Found')
            }
        })
        .catch((err) => {
            if (err.message === "Internal server error") {
                helper(res, 500, false, err.message);
            }
            return helper(res, 400, false, err.message);
        });
};


exports.update = async (req, res) => {
    const id = req.params.id;
    const {
        nameProduct,
        purchasePrice,
        sellingPrice,
        stock
    } = req.body;

    const initialResult = await productModels.getProductId(id)
    const data = {
        nameProduct: nameProduct === undefined ? initialResult[0].nameProduct : nameProduct,
        purchasePrice: purchasePrice === undefined ? initialResult[0].purchasePrice : purchasePrice,
        sellingPrice: sellingPrice === undefined ? initialResult[0].sellingPrice : sellingPrice,
        stock: stock === undefined ? initialResult[0].stock : stock
    };

    productModels
        .getProductId(id)
        .then((result) => {
            let image;
            if (!req.file) {
                image = result[0].image;
            } else {
                const oldImage = result[0].image;
                if (oldImage !== "images\\avatar.png") {
                }
                image = `images\\${req.file.filename}`;
            }
            data.image = image;
            return productModels.updateProduct(id, data);
        })
        .then((result) => {
            helper(res, 200, "Users has been updated", result);
        })
        .catch((err) => {
            if (err.message === "Internal server error") {
                helper(res, 500, err.message);
            }
            helper(res, 400, err.message);
        });
};
