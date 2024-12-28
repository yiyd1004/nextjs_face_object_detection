/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    //basePath: "/nextjs_face_object_detection",
    images: {
        unoptimized: true,
    },
    headers: async () => {
        return [
            {
                source: "/",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "*",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
