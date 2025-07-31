import { PrismaClient, UserRole, Department, Gender, BloodGroup } from '@prisma/client';
import { hashPassword, generateStaffId } from '../server/lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const adminStaffId = generateStaffId(UserRole.ADMIN, 'ADMINISTRATION');
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kutrrh.go.ke' },
    update: {},
    create: {
      email: 'admin@kutrrh.go.ke',
      password: adminPassword,
      role: UserRole.ADMIN,
      staffId: adminStaffId,
      staff: {
        create: {
          staffId: adminStaffId,
          firstName: 'System',
          lastName: 'Administrator',
          phone: '+254700000001',
          email: 'admin@kutrrh.go.ke',
          department: Department.ADMINISTRATION,
          position: 'System Administrator',
          hireDate: new Date('2024-01-01')
        }
      }
    }
  });

  // Create sample doctors
  const doctorPassword = await hashPassword('doctor123');
  
  const doctor1StaffId = generateStaffId(UserRole.DOCTOR, 'CARDIOLOGY');
  const doctor1 = await prisma.user.upsert({
    where: { email: 'dr.kamau@kutrrh.go.ke' },
    update: {},
    create: {
      email: 'dr.kamau@kutrrh.go.ke',
      password: doctorPassword,
      role: UserRole.DOCTOR,
      staffId: doctor1StaffId,
      staff: {
        create: {
          staffId: doctor1StaffId,
          firstName: 'James',
          lastName: 'Kamau',
          phone: '+254700000002',
          email: 'dr.kamau@kutrrh.go.ke',
          department: Department.CARDIOLOGY,
          position: 'Consultant Cardiologist',
          specialization: 'Interventional Cardiology',
          hireDate: new Date('2020-03-15')
        }
      }
    }
  });

  const doctor2StaffId = generateStaffId(UserRole.DOCTOR, 'PEDIATRICS');
  const doctor2 = await prisma.user.upsert({
    where: { email: 'dr.wanjiku@kutrrh.go.ke' },
    update: {},
    create: {
      email: 'dr.wanjiku@kutrrh.go.ke',
      password: doctorPassword,
      role: UserRole.DOCTOR,
      staffId: doctor2StaffId,
      staff: {
        create: {
          staffId: doctor2StaffId,
          firstName: 'Grace',
          lastName: 'Wanjiku',
          phone: '+254700000003',
          email: 'dr.wanjiku@kutrrh.go.ke',
          department: Department.PEDIATRICS,
          position: 'Pediatrician',
          specialization: 'Neonatology',
          hireDate: new Date('2019-08-20')
        }
      }
    }
  });

  // Create nurse
  const nursePassword = await hashPassword('nurse123');
  const nurseStaffId = generateStaffId(UserRole.NURSE, 'EMERGENCY');
  
  const nurse = await prisma.user.upsert({
    where: { email: 'nurse.akinyi@kutrrh.go.ke' },
    update: {},
    create: {
      email: 'nurse.akinyi@kutrrh.go.ke',
      password: nursePassword,
      role: UserRole.NURSE,
      staffId: nurseStaffId,
      staff: {
        create: {
          staffId: nurseStaffId,
          firstName: 'Mary',
          lastName: 'Akinyi',
          phone: '+254700000004',
          email: 'nurse.akinyi@kutrrh.go.ke',
          department: Department.EMERGENCY,
          position: 'Senior Nurse',
          hireDate: new Date('2021-02-10')
        }
      }
    }
  });

  // Create receptionist
  const receptionistPassword = await hashPassword('reception123');
  const receptionistStaffId = generateStaffId(UserRole.RECEPTIONIST, 'ADMINISTRATION');
  
  const receptionist = await prisma.user.upsert({
    where: { email: 'reception@kutrrh.go.ke' },
    update: {},
    create: {
      email: 'reception@kutrrh.go.ke',
      password: receptionistPassword,
      role: UserRole.RECEPTIONIST,
      staffId: receptionistStaffId,
      staff: {
        create: {
          staffId: receptionistStaffId,
          firstName: 'Jane',
          lastName: 'Muthoni',
          phone: '+254700000005',
          email: 'reception@kutrrh.go.ke',
          department: Department.ADMINISTRATION,
          position: 'Receptionist',
          hireDate: new Date('2022-01-15')
        }
      }
    }
  });

  // Create sample patients
  const patients = [
    {
      patientNumber: 'P000001',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1985-06-15'),
      gender: Gender.MALE,
      phone: '+254701234567',
      nationalId: '12345678',
      county: 'Nairobi',
      emergencyContactName: 'Jane Doe',
      emergencyContactPhone: '+254701234568',
      emergencyContactRelation: 'Spouse',
      bloodGroup: BloodGroup.O_POSITIVE
    },
    {
      patientNumber: 'P000002',
      firstName: 'Sarah',
      lastName: 'Wanjiku',
      dateOfBirth: new Date('1990-03-22'),
      gender: Gender.FEMALE,
      phone: '+254702345678',
      email: 'sarah.wanjiku@email.com',
      nationalId: '23456789',
      nhifNumber: 'NHIF123456',
      county: 'Kiambu',
      emergencyContactName: 'Peter Wanjiku',
      emergencyContactPhone: '+254702345679',
      emergencyContactRelation: 'Husband',
      bloodGroup: BloodGroup.A_POSITIVE
    },
    {
      patientNumber: 'P000003',
      firstName: 'Michael',
      lastName: 'Otieno',
      dateOfBirth: new Date('1978-11-08'),
      gender: Gender.MALE,
      phone: '+254703456789',
      nationalId: '34567890',
      county: 'Kisumu',
      emergencyContactName: 'Grace Otieno',
      emergencyContactPhone: '+254703456790',
      emergencyContactRelation: 'Sister',
      bloodGroup: BloodGroup.B_POSITIVE
    }
  ];

  for (const patientData of patients) {
    await prisma.patient.upsert({
      where: { nationalId: patientData.nationalId },
      update: {},
      create: patientData
    });
  }

  // Create sample drugs
  const drugs = [
    {
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      category: 'Analgesic',
      description: 'Pain relief and fever reducer',
      unitPrice: 5.0,
      stockQuantity: 150,
      reorderLevel: 100,
      manufacturer: 'Pharmaceutical Company Ltd'
    },
    {
      name: 'Amoxicillin 250mg',
      genericName: 'Amoxicillin',
      category: 'Antibiotic',
      description: 'Broad spectrum antibiotic',
      unitPrice: 15.0,
      stockQuantity: 80,
      reorderLevel: 50,
      manufacturer: 'MediCare Pharmaceuticals'
    },
    {
      name: 'Atorvastatin 20mg',
      genericName: 'Atorvastatin',
      category: 'Statin',
      description: 'Cholesterol lowering medication',
      unitPrice: 45.0,
      stockQuantity: 60,
      reorderLevel: 30,
      manufacturer: 'CardioMed Ltd'
    }
  ];

  for (const drugData of drugs) {
    const existingDrug = await prisma.drug.findFirst({
      where: { name: drugData.name }
    });

    if (!existingDrug) {
      await prisma.drug.create({
        data: drugData
      });
    }
  }

  // Create sample lab tests
  const labTests = [
    {
      name: 'Complete Blood Count (CBC)',
      category: 'Hematology',
      description: 'Full blood count including RBC, WBC, platelets',
      price: 800.0
    },
    {
      name: 'Lipid Profile',
      category: 'Biochemistry',
      description: 'Cholesterol and triglyceride levels',
      price: 1200.0
    },
    {
      name: 'Blood Glucose (Fasting)',
      category: 'Biochemistry',
      description: 'Fasting blood sugar test',
      price: 300.0
    },
    {
      name: 'Liver Function Tests',
      category: 'Biochemistry',
      description: 'ALT, AST, Bilirubin tests',
      price: 1500.0
    }
  ];

  for (const testData of labTests) {
    await prisma.labTest.upsert({
      where: { name: testData.name },
      update: {},
      create: testData
    });
  }

  // Create sample inventory items
  const inventoryItems = [
    {
      name: 'Surgical Gloves (Box)',
      category: 'Medical Supplies',
      description: 'Sterile latex surgical gloves',
      quantity: 200,
      unitPrice: 150.0,
      reorderLevel: 50,
      supplier: 'Medical Supplies Co.'
    },
    {
      name: 'Syringes 5ml (Pack)',
      category: 'Medical Supplies',
      description: 'Disposable syringes 5ml',
      quantity: 300,
      unitPrice: 80.0,
      reorderLevel: 100,
      supplier: 'SafeMed Supplies'
    },
    {
      name: 'Bandages (Roll)',
      category: 'Medical Supplies',
      description: 'Elastic bandages for wound care',
      quantity: 150,
      unitPrice: 25.0,
      reorderLevel: 50,
      supplier: 'WoundCare Ltd'
    }
  ];

  for (const itemData of inventoryItems) {
    await prisma.inventoryItem.upsert({
      where: { name: itemData.name },
      update: {},
      create: itemData
    });
  }

  console.log('✅ Database seeding completed!');
  console.log('\n👥 Created users:');
  console.log('- Admin: admin@kutrrh.go.ke (password: admin123)');
  console.log('- Doctor 1: dr.kamau@kutrrh.go.ke (password: doctor123)');
  console.log('- Doctor 2: dr.wanjiku@kutrrh.go.ke (password: doctor123)');
  console.log('- Nurse: nurse.akinyi@kutrrh.go.ke (password: nurse123)');
  console.log('- Receptionist: reception@kutrrh.go.ke (password: reception123)');
  console.log('\n👤 Created 3 sample patients');
  console.log('💊 Created 3 sample drugs');
  console.log('🧪 Created 4 lab tests');
  console.log('📦 Created 3 inventory items');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
