/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    //Remove basePath when you are trying to deploy other than github page
    basePath: "/nextjs_face_object_detection",
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
