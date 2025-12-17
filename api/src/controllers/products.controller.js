const { Product } = require("../models/product.model");

// 🟢 Tạo sản phẩm mới
async function createProduct(req, res, next) {
  try {
    const payload = req.body;
    const slug = payload.slug ? payload.slug : makeSlug(payload.title);
    const doc = await Product.create({ ...payload, slug });
    return res.status(201).json({ ok: true, product: doc.toJSON() });
  } catch (err) {
    if (err && err.code === 11000) {
      err.status = 409; // Conflict: duplicate slug
      err.message = "Duplicate slug";
    }
    return next(err);
  }
}

// 🟠 Cập nhật sản phẩm theo ID
async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const patch = pickUpdatable(req.body);

    // Nếu có title mới mà không có slug -> tự tạo slug
    if (patch.title && !patch.slug) patch.slug = makeSlug(patch.title);

    const updated = await Product.findByIdAndUpdate(id, patch, { new: true, runValidators: true });
    if (!updated)
      return res.status(404).json({
        ok: false,
        error: { code: "NOT_FOUND", message: "Product not found" },
      });

    return res.json({ ok: true, product: updated.toJSON() });
  } catch (err) {
    if (err && err.code === 11000) {
      err.status = 409;
      err.message = "Duplicate slug";
    }
    return next(err);
  }
}

// 🔴 Xóa sản phẩm theo ID (bạn đã có sẵn)
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const del = await Product.findByIdAndDelete(id);
    if (!del)
      return res.status(404).json({
        ok: false,
        error: { code: "NOT_FOUND", message: "Product not found" },
      });
    return res.json({ ok: true, deletedId: id });
  } catch (err) {
    return next(err);
  }
}

// 📦 Export tất cả
module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
};
