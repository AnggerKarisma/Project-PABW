import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import BlogPostboxArea from "@/components/blog/blog-postox/blog-postbox-area";

const BlogPostBoxPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Blog" />
      <HeaderTwo style_2={true} />
      <BlogPostboxArea/>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default BlogPostBoxPage;
