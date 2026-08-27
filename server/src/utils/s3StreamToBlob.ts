// Helper to process AWS s3 stream chunks into an in-memory Node Blob 

export async function streamToBlob(stream: any, contentType: string): Promise<Blob> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }
    const finalBuffer = Buffer.concat(chunks);
    return new Blob([finalBuffer], { type: contentType });
}

