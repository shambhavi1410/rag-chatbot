import streamlit as st

st.set_page_config(page_title="My First App")

st.title("Hello 👋")
st.write("My website is now running on Streamlit!")

name = st.text_input("Enter your name")
if name:
    st.success(f"Welcome, {name}!")
