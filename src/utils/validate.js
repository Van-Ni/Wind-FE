export const fileValid = (file) => {
    // Validate allowed types
    if (file.type.includes('image')) {
        const allowedTypes = ['image/jpeg', 'image/png'];
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        if (!allowedExtensions.test(file.name)) {
            return 'Only JPEG and PNG files are allowed';
        }
    } else if (file.type.includes('application')) {
        const allowedExtensions = /(\.pdf|\.docx)$/i;
        if (!allowedExtensions.test(file.name)) {
            return 'Only PDF and DOCX files are allowed';
        }
    }else{
        return 'You are not allowed to upload this file type."';
    }

    // Validate size (in bytes)
    const maxSize = 1048576; // 1MB
    if (file.size > maxSize) {
        return 'File size exceeds the allowed limit';
    }

    // Validate maximum number of files
    const maxFiles = 1;
    if (file.length >= maxFiles) {
        return `You can only upload up to ${maxFiles} files`;
    }
    return "";
};


export const fileTypeValid = (file) => {
    let type = "";
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
        type = "Image";
        // TODO : SIZE THE FILE
    } else if (file.type === 'application/pdf') {
        type = "Document";
    }
    return type;
}
