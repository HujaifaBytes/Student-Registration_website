import pandas as pd
import os
import tkinter as tk
from tkinter import ttk, messagebox

# --- 1. BACKEND LOGIC (Excel and ID Generation) ---

EXCEL_FILE = "Student Data.xlsx"

def load_or_create_dataframe():
    """
    Loads the Excel file into a pandas DataFrame.
    If the file doesn't exist, it creates an empty DataFrame with the correct columns.
    """
    if os.path.exists(EXCEL_FILE):
        # THE FIX IS HERE: We force the 'Registration ID' column to be read as a string (str).
        return pd.read_excel(EXCEL_FILE, dtype={'Registration ID': str})
    else:
        columns = ["Name", "School", "Class", "Subject", "Gender", "Registration ID"]
        return pd.DataFrame(columns=columns)

def save_to_excel(df):
    """
    Saves the DataFrame to the Excel file and auto-fits column widths for a nice design.
    """
    # Using 'openpyxl' engine is necessary for the column auto-fitting part.
    with pd.ExcelWriter(EXCEL_FILE, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Students')
        
        # Auto-fit columns for better readability
        for column in writer.sheets['Students'].columns:
            max_length = 0
            column_letter = column[0].column_letter
            
            # Check header length
            if len(str(writer.sheets['Students'][column_letter + '1'].value)) > max_length:
                max_length = len(str(writer.sheets['Students'][column_letter + '1'].value))
            
            # Check each cell in the column for the max length
            for cell in writer.sheets['Students'][column_letter]:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            
            # Add a little extra space and set the width
            adjusted_width = (max_length + 2)
            writer.sheets['Students'].column_dimensions[column_letter].width = adjusted_width


def get_next_sequential_number(df, school_code, class_code, subject_code, gender_code):
    """
    Checks the DataFrame for existing records with the same combination
    and returns the next sequential number.
    """
    unique_prefix = f"3{school_code}{class_code}{subject_code}{gender_code}"

    # This line now works correctly because the column is guaranteed to be a string.
    mask = df["Registration ID"].str.startswith(unique_prefix, na=False)
    matching_records = df[mask]

    if matching_records.empty:
        return "001"
    else:
        last_id = matching_records["Registration ID"].max()
        last_seq_num = int(last_id[-3:])
        next_seq_num = last_seq_num + 1
        return f"{next_seq_num:03d}"


def generate_registration_id(df, name, school, student_class, subject, gender):
    """
    Generates a 10-digit registration ID based on student's details.
    """
    # Society Code (1 digit)
    society_code = "3"
    # School Code (2 digits)
    school_codes = {"SCPSC": "01", "JUSC": "02", "BPATC": "03", "GBS": "04", "SCLS": "05"}
    school_code = school_codes.get(school)
    # Class Code (2 digits)
    class_code = f"{student_class:02d}"
    # Subject Code (1 digit)
    subject_code = ""
    if 5 <= student_class <= 8:
        if subject == "Science": subject_code = "1"
        elif subject == "Math": subject_code = "2"
    elif 9 <= student_class <= 10:
        if subject == "Math": subject_code = "2"
        elif subject == "Physics": subject_code = "3"
    # Gender Code (1 digit)
    gender_codes = {"Male": "1", "Female": "2"}
    gender_code = gender_codes.get(gender)
    # Sequential Number (3 digits)
    sequential_number = get_next_sequential_number(df, school_code, class_code, subject_code, gender_code)
    
    registration_id = f"{society_code}{school_code}{class_code}{subject_code}{gender_code}{sequential_number}"
    
    new_student_data = {
        "Name": name,
        "School": school,
        "Class": student_class,
        "Subject": subject,
        "Gender": gender,
        "Registration ID": registration_id
    }
    
    return registration_id, new_student_data


# --- 2. GUI LOGIC (Tkinter Application) ---

class RegistrationApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Student Registration | Savar Science Society")
        self.root.geometry("480x450")

        self.name_var = tk.StringVar()
        self.school_var = tk.StringVar()
        self.class_var = tk.IntVar()
        self.subject_var = tk.StringVar()
        self.gender_var = tk.StringVar()

        self.create_widgets()
        self.class_var.trace("w", self.update_subject_options)
        self.class_var.set(5)

    def create_widgets(self):
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(expand=True, fill="both")

        ttk.Label(main_frame, text="Student Name:", font=("Helvetica", 12)).grid(row=0, column=0, sticky="w", pady=5)
        name_entry = ttk.Entry(main_frame, textvariable=self.name_var, font=("Helvetica", 12), width=30)
        name_entry.grid(row=0, column=1, sticky="ew", pady=5)

        ttk.Label(main_frame, text="School:", font=("Helvetica", 12)).grid(row=1, column=0, sticky="w", pady=5)
        school_menu = ttk.OptionMenu(main_frame, self.school_var, "Select School", "SCPSC", "JUSC", "BPATC", "GBS", "SCLS")
        school_menu.grid(row=1, column=1, sticky="ew", pady=5)

        ttk.Label(main_frame, text="Class:", font=("Helvetica", 12)).grid(row=2, column=0, sticky="w", pady=5)
        class_menu = ttk.OptionMenu(main_frame, self.class_var, 5, 5, 6, 7, 8, 9, 10)
        class_menu.grid(row=2, column=1, sticky="ew", pady=5)

        ttk.Label(main_frame, text="Subject:", font=("Helvetica", 12)).grid(row=3, column=0, sticky="w", pady=5)
        self.subject_menu = ttk.OptionMenu(main_frame, self.subject_var, "Select Subject")
        self.subject_menu.grid(row=3, column=1, sticky="ew", pady=5)

        ttk.Label(main_frame, text="Gender:", font=("Helvetica", 12)).grid(row=4, column=0, sticky="w", pady=5)
        gender_menu = ttk.OptionMenu(main_frame, self.gender_var, "Select Gender", "Male", "Female")
        gender_menu.grid(row=4, column=1, sticky="ew", pady=5)

        generate_button = ttk.Button(main_frame, text="Generate ID and Save to Excel", command=self.on_generate_click)
        generate_button.grid(row=5, columnspan=2, pady=25)
        
        ttk.Label(main_frame, text="Generated ID:", font=("Helvetica", 12, "bold")).grid(row=6, column=0, sticky="w", pady=5)
        self.result_label = ttk.Label(main_frame, text="", font=("Courier", 16, "bold"), foreground="blue")
        self.result_label.grid(row=6, column=1, sticky="w", pady=5)

    def update_subject_options(self, *args):
        selected_class = self.class_var.get()
        menu = self.subject_menu["menu"]
        menu.delete(0, "end")
        
        new_options = []
        if 5 <= selected_class <= 8: new_options = ["Science", "Math"]
        elif 9 <= selected_class <= 10: new_options = ["Math", "Physics"]
            
        self.subject_var.set("Select Subject")
        for option in new_options:
            menu.add_command(label=option, command=lambda value=option: self.subject_var.set(value))

    def on_generate_click(self):
        name = self.name_var.get().strip()
        school = self.school_var.get()
        student_class = self.class_var.get()
        subject = self.subject_var.get()
        gender = self.gender_var.get()

        if not name or "Select" in [school, subject, gender]:
            messagebox.showwarning("Input Error", "Please fill out the name and select an option for all fields.")
            return

        try:
            df = load_or_create_dataframe()
            registration_id, new_data = generate_registration_id(df, name, school, student_class, subject, gender)
            new_df = pd.DataFrame([new_data])
            df = pd.concat([df, new_df], ignore_index=True)
            save_to_excel(df)
            
            self.result_label.config(text=registration_id)
            messagebox.showinfo("Success", f"Student '{name}' has been saved to '{EXCEL_FILE}' with ID: {registration_id}")
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {e}")


# --- 3. RUN THE APPLICATION ---
if __name__ == "__main__":
    app_root = tk.Tk()
    app = RegistrationApp(app_root)
    app_root.mainloop()
