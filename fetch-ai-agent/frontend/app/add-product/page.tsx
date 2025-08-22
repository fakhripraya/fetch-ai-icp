import styles from "./add-product.module.css"

export default function AddProductForm() {
  return (
    <div className={styles["add-product-container"]}>
      <div className={styles["add-product-wrapper"]}>
        <div className={styles["add-product-text-container"]}>
          <div className={styles["add-product-text-wrapper"]}>
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

            <div className={styles["add-product-textinput-box"]}>
              <label htmlFor="product-name" className={styles["add-product-input-title"]}>
                Product Name:
              </label>
              <input
                type="text"
                id="product-name"
                className={styles["add-product-textinput"]}
                placeholder="Enter product name"
              />
            </div>

            <div className={styles["add-product-textinput-box"]}>
              <label htmlFor="product-price" className={styles["add-product-input-title"]}>
                Price:
              </label>
              <input
                type="number"
                id="product-price"
                className={styles["add-product-textinput"]}
                placeholder="Enter price"
              />
            </div>

            <div className={styles["add-product-textinput-box"]} style={{ alignItems: "flex-start" }}>
              <label htmlFor="product-description" className={styles["add-product-input-title"]}>
                Description:
              </label>
              <textarea
                id="product-description"
                className={styles["add-product-longtext-area"]}
                placeholder="Enter product description"
              ></textarea>
            </div>

            <button className={styles["add-product-button"]}>
              <span className={styles["add-product-button-text"]}>Add Product</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
