// "use server";

// import { auth } from "~/server/auth"; 
// import AWS from "aws-sdk";
// // import DownloadRecentThumbnail from "./Download";

// const Recent = async () => {
//   const session = await auth(); 
//   if (!session?.user?.id) {
//     return <p style={{ color: 'red' }}>You must be logged in to view thumbnails.</p>;
//   }

//   const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY,
//     region: process.env.AWS_REGION,
//   });

//   const prefix = `${session.user.id}/`;

//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME!,
//     Prefix: prefix,
//     MaxKeys: 10,
//   };

//   const data = await s3.listObjectsV2(params).promise();

//   const recentThumbnails = data.Contents?.sort((a, b) => {
//     const dateA = new Date(a.LastModified ?? 0).getTime();
//     const dateB = new Date(b.LastModified ?? 0).getTime();
//     return dateB - dateA;
//   }).map((item) => ({
//     url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
//     createdAt: item.LastModified ?? new Date(),
//   }));

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column' }}>
//       <h3 style={{ fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01562em' }}>
//         Recent thumbnails
//       </h3>
//       <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
//         Download your most recent thumbnails.
//       </p>
//       <hr style={{ margin: '0.5rem 0' }} />
//       {recentThumbnails?.length === 0 ? (
//         <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
//           No recent thumbnails.
//         </p>
//       ) : (
//         <div style={{ display: 'flex', height: 'auto', maxWidth: '100%', gap: '0.5rem', overflowX: 'scroll' }}>
//           {recentThumbnails?.map((thumbnail) => (
//             <div key={thumbnail.url} style={{ display: 'flex', minWidth: 'fit-content', flexDirection: 'column', gap: '0.25rem' }}>
//               <img
//                 src={thumbnail.url}
//                 alt="image"
//                 style={{ height: '14rem', width: 'auto', borderRadius: '0.5rem', objectFit: 'contain' }}
//               />
//               <p style={{ fontSize: '0.875rem' }}>
//                 From{" "}
//                 {new Date(thumbnail.createdAt).toLocaleDateString("en-GB", {
//                   day: "2-digit",
//                   month: "2-digit",
//                   year: "numeric",
//                 })}
//               </p>
//               {/* <DownloadRecentThumbnail url={thumbnail.url} /> */}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Recent;
