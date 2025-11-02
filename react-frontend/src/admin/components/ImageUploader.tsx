import React, { useState } from 'react';
import { useInput, FieldTitle } from 'react-admin';

type Props = {
	source: string;
	label?: string;
};

const ImageUploader: React.FC<Props> = ({ source, label }) => {
		const { field } = useInput({ source });
	const [preview, setPreview] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);

		// If field.value already contains an id, set preview URL
		React.useEffect(() => {
			const v = (field as any).value;
			if (v) setPreview(`/api/imagenes/${v}`);
		}, [(field as any).value]);

	const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		if (!file) return;
		setUploading(true);
			try {
			const reader = new FileReader();
			reader.onload = async () => {
				const base64 = (reader.result as string) || '';
				// Strip data: prefix if present when sending
				const payload = { filename: file.name, data: base64 };
				const res = await fetch('/api/imagenes', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				});
						if (!res.ok) {
					const text = await res.text();
					console.error('Upload failed', res.status, text);
					alert('Error al subir la imagen: ' + res.status);
					setUploading(false);
					return;
				}
				const data = await res.json();
				const id = data.id;
				// Set the input value (product_image_id)
						(field as any).onChange(id);
				// Also set preview URL
				setPreview(`/api/imagenes/${id}`);
			};
			reader.readAsDataURL(file);
		} catch (err) {
			console.error('Error uploading image', err);
			alert('Error al subir la imagen');
		} finally {
			setUploading(false);
		}
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
			<label style={{ fontWeight: 600 }}><FieldTitle label={label} source={source} /></label>
			{preview ? (
				<img src={preview} alt="preview" style={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 6 }} />
			) : (
				<div style={{ width: 160, height: 120, background: '#f3f3f3', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#777' }}>
					Sin imagen
				</div>
			)}
			<input type="file" accept="image/*" onChange={onFileChange} />
			{uploading && <div>Subiendo...</div>}
		</div>
	);
};

export default ImageUploader;
