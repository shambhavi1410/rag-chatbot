import streamlit as st

st.title("My Streamlit App 🚀")
st.write("Updated from GitHub!")


name = st.text_input("Enter your name")
if name:
    st.success(f"Welcome, {name}!")
