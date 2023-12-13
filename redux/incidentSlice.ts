// incidentSlice.ts
import axios from '@/pages/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Incident {
    id: string;
    dateTime: string;
    description: string;
    severity: string;
    reporter: string;
}

export interface IncidentSlice {
    incident: Incident | null;
    incidents: [Incident] | [];
    isLoading: boolean;
    error: string | null;
}

const initialState: IncidentSlice = {
    incident: null,
    incidents: [],
    isLoading: false,
    error: null,
};

// Async thunk for report incident
export const incidentAsync = createAsyncThunk('report-incident', async (incident: { dateTime: string, description: string, severity: string }, { dispatch }) => {
    try {
        // Perform API call to store the incident
        const response = await axios.post('/report-incident', incident);
        const { data } = response;

        // Dispatch the incident to the Redux store
        dispatch(reportIncident(data));

        return data;
    } catch (error) {
        // Handle error
        console.error('Save failed:', error);
        throw error;
    }
});

// Async thunk for fetching all incidents
export const getIncidentsAsync = createAsyncThunk('list-incidents', async (_, { dispatch }) => {
    try {
        // Perform API call to store the incident
        const response = await axios.get('/list-incidents');
        const { data } = response;

        // Dispatch the incident to the Redux store
        dispatch(listIncidents(data));

        return data;
    } catch (error) {
        // Handle error
        console.error('Save failed:', error);
        throw error;
    }
});

// Async thunk for deleting incident
export const deleteIncidentAsync = createAsyncThunk('delete-incident', async (incidentId, { dispatch }) => {
    try {
        // Perform API call to store the incident
        const response = await axios.delete(`/delete-incident/${incidentId}`);
        const { data } = response;

        // Dispatch the incident to the Redux store
        dispatch(deleteIncident(data));

        return data;
    } catch (error) {
        // Handle error
        console.error('Save failed:', error);
        throw error;
    }
});

// Slice
const incidentSlice = createSlice({
    name: 'incident',
    initialState,
    reducers: {
        reportIncident: (state, action: PayloadAction<Incident | null>) => {
            state.incident = action.payload;
        },
        listIncidents: (state, action: PayloadAction<[Incident] | []>) => {
            state.incidents = [...action.payload] || [];
        },
        deleteIncident: (state, action: PayloadAction<Incident | null>) => {
            state.incidents = state.incidents.filter((incident: Incident) => incident.id !== action.payload.id);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(incidentAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(incidentAsync.fulfilled, (state, action) => {
                state.incident = action.payload;
                state.incidents.push({ ...action.payload });
                state.isLoading = false;
                state.error = null;
            })
            .addCase(incidentAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 'Save Failed!';
            })

            // fetching lists
            .addCase(getIncidentsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getIncidentsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(getIncidentsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 'Fetching Failed!';
            })

            // deleting incident
            .addCase(deleteIncidentAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteIncidentAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(deleteIncidentAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 'Fetching Failed!';
            })
    },
});

// Actions
export const { reportIncident, listIncidents, deleteIncident } = incidentSlice.actions;

// Selectors
export const selectIncident = (state: { incident: IncidentSlice }) => state.incident.incident;
export const selectIncidents = (state: { incident: IncidentSlice }) => state.incident.incidents;
export const selectIncidentError = (state: { incident: IncidentSlice }) => state.incident.error;

// Reducer
export default incidentSlice.reducer;
