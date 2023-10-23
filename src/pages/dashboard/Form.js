import React, { useState } from 'react';
import axios from "../../utils/axios";
const Form = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [content, setContent] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("image", selectedFile);
        // formData.append("content", content);

        try {
            const response = await axios({
                method: "post",
                url: "http://localhost:3001/post",
                data: formData,
                headers: { 
                    "Accept" : "*/*",
                    "Content-Type": "multipart/form-data"
                 },
            });
            // await axios
            //     .post(
            //         "/post",
            //         {
            //             formData,
            //         },
            //         {
            //             headers: {
            //                 "Content-Type": "multipart/form-data"
            //             }
            //         }
            //     )
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="content" value={content} onChange={handleContentChange} />
            <input type="file" onChange={handleFileSelect} />
            <input type="submit" value="Upload File" />
        </form>
    );
};

export default Form;