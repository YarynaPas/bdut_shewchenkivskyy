import { Request, RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { Employee } from "../models/employees.model";

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads', 'employees');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const upload = multer({ storage: multer.memoryStorage() }).single('main_photo');

// --- Хелпери ---
const parseId = (id: string | string[]): number | null => {
    const raw = Array.isArray(id) ? id[0] : id;
    const parsed = Number(raw);
    return isNaN(parsed) ? null : parsed;
};

const getFullImageUrl = (req: Request, imagePath: string | null): string | null =>
    imagePath ? `${req.protocol}://${req.get('host')}${imagePath}` : null;

const deleteFile = async (filePath: string): Promise<void> => {
    await fs.promises.unlink(path.join(PUBLIC_DIR, filePath)).catch(() => null);
};

const processImage = async (buffer: Buffer, fileName: string): Promise<string> => {
    await sharp(buffer)
        .resize(800, 1000, { fit: 'cover' })
        .webp({ quality: 85 })
        .toFile(path.join(UPLOAD_DIR, fileName));
    return `/uploads/employees/${fileName}`;
};

// --- Контролер ---
class EmployeeController {
    createEmployee: RequestHandler = (req, res) => {
        upload(req, res, async (err) => {
            if (err) return res.status(400).json({ message: err.message });
            if (!req.file) return res.status(400).json({ message: 'Photo required' });

            try {
                const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
                const photoPath = await processImage(req.file.buffer, fileName);

                const employee = await Employee.create({
                    ...req.body,
                    main_photo: photoPath,
                });

                res.status(201).json({
                    ...employee.toJSON(),
                    main_photo: getFullImageUrl(req, photoPath),
                });
            } catch (e) {
                console.error('Error creating employee:', e);
                res.status(500).json({ message: 'Error creating employee' });
            }
        });
    };

    getAllEmployees: RequestHandler = async (req, res) => {
        try {
            const employees = await Employee.findAll();
            res.json(employees.map(e => ({
                ...e.toJSON(),
                main_photo: getFullImageUrl(req, e.main_photo),
            })));
        } catch (e) {
            console.error('Error getting employees:', e);
            res.status(500).json({ message: 'Error getting employees' });
        }
    };

    getEmployeeById: RequestHandler = async (req, res) => {
        // FIX 1
        const id = parseId(req.params.id);
        if (!id) { res.status(400).json({ message: 'Invalid id' }); return; }

        try {
            const employee = await Employee.findByPk(id);
            if (!employee) return res.status(404).json({ message: 'Not found' });

            res.json({
                ...employee.toJSON(),
                main_photo: getFullImageUrl(req, employee.main_photo),
            });
        } catch (e) {
            console.error('Error getting employee:', e);
            res.status(500).json({ message: 'Error getting employee' });
        }
    };

    updateEmployee: RequestHandler = (req, res) => {
        upload(req, res, async (err) => {
            // FIX 2
            const id = parseId(req.params.id);
            if (!id) { res.status(400).json({ message: 'Invalid id' }); return; }

            try {
                const employee = await Employee.findByPk(id);
                if (!employee) return res.status(404).json({ message: 'Not found' });

                let photoPath = employee.main_photo;

                if (req.file) {
                    if (employee.main_photo) await deleteFile(employee.main_photo);
                    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
                    photoPath = await processImage(req.file.buffer, fileName);
                }

                await employee.update({ ...req.body, main_photo: photoPath });

                res.json({
                    ...employee.toJSON(),
                    main_photo: getFullImageUrl(req, photoPath),
                });
            } catch (e) {
                console.error('Error updating employee:', e);
                res.status(500).json({ message: 'Update error' });
            }
        });
    };

    deleteEmployee: RequestHandler = async (req, res) => {
        // FIX 3
        const id = parseId(req.params.id);
        if (!id) { res.status(400).json({ message: 'Invalid id' }); return; }

        try {
            const employee = await Employee.findByPk(id);
            if (!employee) return res.status(404).json({ message: 'Not found' });

            if (employee.main_photo) await deleteFile(employee.main_photo);

            await employee.destroy();
            res.json({ message: 'Deleted' });
        } catch (e) {
            console.error('Error deleting employee:', e);
            res.status(500).json({ message: 'Delete error' });
        }
    };
}

export const employeeController = new EmployeeController();