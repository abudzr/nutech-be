// const { query } = require('express')
const connection = require('../configs/db')


exports.insertProduct = (data) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO product SET ?", data, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                console.log(err);
                reject(new Error("Internal server error"));
            }
        });
    });
};

exports.getAllProduct = (queryPage, queryPerPage, keyword, sortBy, order) => {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT COUNT(*) AS totalData FROM product WHERE nameProduct LIKE ?",
            [`%${keyword}%`, `%${keyword}%`],
            (err, result) => {
                let totalData, page, perPage, totalPage;
                if (err) {
                    console.log(err);
                    reject(new Error("Internal server error"));
                } else {
                    totalData = result[0].totalData;
                    page = queryPage ? parseInt(queryPage) : 1;
                    perPage = queryPerPage ? parseInt(queryPerPage) : 5;
                    totalPage = Math.ceil(totalData / perPage);
                }
                const firstData = perPage * page - perPage;
                connection.query(
                    `SELECT * FROM product WHERE nameProduct LIKE ? ORDER BY ${sortBy} ${order} LIMIT ?, ?`,
                    [`%${keyword}%`, firstData, perPage],
                    (err, result) => {
                        if (err) {
                            reject(new Error("Internal server error"));
                        } else {
                            resolve([totalData, totalPage, result, page, perPage]);
                        }
                    }
                );
            }
        );
    });
};


exports.getProduct = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM product', (err, results) => {
            if (!err) {
                resolve(results)
            } else {
                reject(new Error("Internal server error"));
            }
        })
    })
};

exports.getProductId = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM product WHERE id = ?', id, (err, results) => {
            if (!err) {
                resolve(results)
            } else {
                reject(new Error("Internal server error"));
            }
        })
    })
};

exports.deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        connection.query("DELETE FROM product WHERE id = ?", id, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(new Error("Internal server error"));
            }
        });
    });
};

exports.updateProduct = (id, data) => {
    return new Promise((resolve, reject) => {
        connection.query(
            "UPDATE product SET ? WHERE id = ?",
            [data, id],
            (err, result) => {
                if (!err) {
                    connection.query(
                        "SELECT * FROM product WHERE id = ?",
                        id,
                        (err, result) => {
                            if (!err) {
                                resolve(result);
                            } else {
                                reject(new Error("Internal server error"));
                            }
                        }
                    );
                } else {
                    reject(new Error("Internal server error"));
                }
            }
        );
    });
};