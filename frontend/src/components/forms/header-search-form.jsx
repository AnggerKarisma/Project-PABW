import { useState } from "react";
// internal
import { Search } from "@/svg";
import NiceSelect from "@/ui/nice-select";
import useSearchFormSubmit from "@/hooks/use-search-form-submit";

const HeaderSearchForm = () => {
  const { setSearchText, setCategory, handleSubmit, searchText } = useSearchFormSubmit();

  // selectHandle
  const selectCategoryHandle = (e) => {
    setCategory(e.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="tp-header-search-wrapper d-flex align-items-center">
        <div className="tp-header-search-box">
          <input
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            type="text"
            placeholder="Cari Produk..."
          />
        </div>
        <div className="tp-header-search-category">
          <NiceSelect
            options={[
              { value: "Pilih Kategori", text: "Pilih Kategori" },
              { value: "electronics", text: "electronics" },
              { value: "fashion", text: "fashion" },
              { value: "beauty", text: "beauty" },
              { value: "jewelry", text: "jewelry" },
            ]}
            defaultCurrent={0}
            onChange={selectCategoryHandle}
            name="Pilih Kategori"
          />
        </div>
        <div className="tp-header-search-btn">
          <button type="submit">
            <Search />
          </button>
        </div>
      </div>
    </form>
  );
};

export default HeaderSearchForm;
